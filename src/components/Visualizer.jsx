import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import classNames from 'classnames';
import { useSystemStore } from '../store/systemStore.js';
import { vertexServiceId } from '../core/index.js';

const WIDTH = 960;
const HEIGHT = 780;
const CENTER = { x: WIDTH / 2, y: 390 };
const PENTAGON_RADIUS = 268;

/**
 * Petrie-polygon (pentagon) projection of the 5-cell: the five vertices
 * are placed on a regular pentagon so the 10 Rn edges render as the
 * pentagon perimeter plus the pentagram diagonals of the complete K5
 * graph. Visual (clockwise) order of the vertex regions.
 */
const VERTEX_ORDER = ['cerebral', 'autonomic', 'environmental', 'integration', 'somatic'];

const VERTEX_CENTERS = Object.fromEntries(
  VERTEX_ORDER.map((id, index) => {
    const angle = (-90 + index * 72) * (Math.PI / 180);
    return [id, {
      x: CENTER.x + PENTAGON_RADIUS * Math.cos(angle),
      y: CENTER.y + PENTAGON_RADIUS * Math.sin(angle),
    }];
  }),
);

const REGION_RADII = { integration: 62 };
const DEFAULT_REGION_RADIUS = 118;

/** Deterministic layout: services ring their vertex region center. */
function buildLayout(vertices) {
  const nodes = new Map();
  for (const vertex of Object.values(vertices)) {
    const center = VERTEX_CENTERS[vertex.id] ?? CENTER;
    const count = vertex.services.length;
    vertex.services.forEach((service, index) => {
      const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
      const ring = count === 1 ? 0 : 72;
      const id = vertexServiceId(vertex, service);
      nodes.set(id, {
        id,
        label: service.code,
        title: `${vertex.name} ${service.name} — ${service.role}`,
        x: center.x + ring * Math.cos(angle),
        y: center.y + ring * Math.sin(angle),
        color: vertex.color,
        kind: vertex.id === 'integration' ? 'shared' : vertex.id === 'environmental' ? 'external' : 'service',
        vertexId: vertex.id,
      });
    });
  }
  return nodes;
}

function pathThrough(points) {
  const line = d3.line().x((d) => d.x).y((d) => d.y).curve(d3.curveCatmullRom.alpha(0.7));
  return line(points);
}

/**
 * Visualizer — D3 Petrie-polygon projection of the pentachoral (5-cell)
 * System 5 architecture. Solid edges are Relational Wholes (closed
 * circuits, drawn through their pivot); dashed edges are Projections
 * (open paths through their stages). Hover or pin a tetrahedral cell to
 * highlight its 4 vertices and 6 edges.
 */
export default function Visualizer() {
  const svgRef = useRef(null);
  const vertices = useSystemStore((state) => state.vertices);
  const snapshot = useSystemStore((state) => state.snapshot);
  const [pinnedCell, setPinnedCell] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const selectedCellId = hoveredCell ?? pinnedCell;

  const nodes = useMemo(() => buildLayout(vertices), [vertices]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const cell = snapshot.pentachoron.cells.find((candidate) => candidate.id === selectedCellId) ?? null;
    const crossEdgeRnIds = new Set(snapshot.pentachoron.edges.map((edge) => edge.rn));
    const inCellRn = (rn) => !cell || cell.rnIds.includes(rn.id) || cell.vertices.includes(rn.triad);
    const inCellPk = (pk) => !cell || cell.vertices.includes(pk.triad);
    const inCellVertex = (vertexId) => !cell || cell.vertices.includes(vertexId);

    const defs = svg.append('defs');
    for (const [id, fill] of [['arrow-rn', '#5f6c85'], ['arrow-pk', '#9aa7bd']]) {
      defs
        .append('marker')
        .attr('id', id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 18)
        .attr('refY', 0)
        .attr('markerWidth', 7)
        .attr('markerHeight', 7)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', fill);
    }

    // Vertex regions on the pentagon.
    const regions = svg.append('g');
    for (const vertex of Object.values(vertices)) {
      const center = VERTEX_CENTERS[vertex.id] ?? CENTER;
      const radius = REGION_RADII[vertex.id] ?? DEFAULT_REGION_RADIUS;
      const dimmed = !inCellVertex(vertex.id);
      regions
        .append('circle')
        .attr('cx', center.x)
        .attr('cy', center.y)
        .attr('r', radius)
        .attr('fill', vertex.color)
        .attr('fill-opacity', dimmed ? 0.03 : 0.12)
        .attr('stroke', vertex.color)
        .attr('stroke-opacity', dimmed ? 0.15 : 0.5);
      regions
        .append('text')
        .attr('x', center.x)
        .attr('y', center.y - radius - 12)
        .attr('text-anchor', 'middle')
        .attr('class', 'viz-triad-label')
        .attr('opacity', dimmed ? 0.25 : 1)
        .text(`${vertex.name} — ${vertex.polarity}`);
    }

    const resolve = (id) => nodes.get(id) ?? CENTER;

    // Pk flows: dashed open paths through their stages.
    const pkGroup = svg.append('g');
    for (const pk of snapshot.pkFlows) {
      const points = pk.stages.map(resolve);
      pkGroup
        .append('path')
        .attr('d', pathThrough(points))
        .attr('fill', 'none')
        .attr('stroke', pk.kind === 'revenue' ? '#4caf82' : '#e0793d')
        .attr('stroke-width', 1.6)
        .attr('stroke-dasharray', '6 5')
        .attr('marker-end', 'url(#arrow-pk)')
        .attr('opacity', inCellPk(pk) ? 0.85 : 0.08)
        .append('title')
        .text(`${pk.id} (${pk.kind}): ${pk.stages.join(' → ')} — total ${pk.total.toFixed(2)}`);
    }

    // Rn flows: solid closed circuits drawn through their pivot.
    const rnGroup = svg.append('g');
    for (const rn of snapshot.rnFlows) {
      const points = [resolve(rn.serviceA), resolve(rn.pivot), resolve(rn.serviceB)];
      const highlighted = cell && inCellRn(rn);
      rnGroup
        .append('path')
        .attr('d', pathThrough(points))
        .attr('fill', 'none')
        .attr('stroke', rn.balanced ? (highlighted ? '#7ea4e0' : '#5f6c85') : '#d9534f')
        .attr('stroke-width', (crossEdgeRnIds.has(rn.id) ? 2.6 : 2) + (highlighted ? 0.8 : 0))
        .attr('marker-end', 'url(#arrow-rn)')
        .attr('marker-start', 'url(#arrow-rn)')
        .attr('opacity', inCellRn(rn) ? 0.9 : 0.08)
        .append('title')
        .text(
          `${rn.id}: ${rn.serviceA} ⇄ ${rn.serviceB} (pivot ${rn.pivot}) — E_R1 ${rn.r1Energy.toFixed(2)} / E_R2 ${rn.r2Energy.toFixed(2)}`,
        );
    }

    // Nodes.
    const nodeGroup = svg.append('g');
    for (const node of nodes.values()) {
      const g = nodeGroup
        .append('g')
        .attr('transform', `translate(${node.x},${node.y})`)
        .attr('opacity', inCellVertex(node.vertexId) ? 1 : 0.15);
      g.append('circle')
        .attr('r', node.kind === 'shared' ? 26 : node.kind === 'external' ? 16 : 20)
        .attr('fill', node.color)
        .attr('fill-opacity', node.kind === 'external' ? 0.4 : 0.9)
        .attr('stroke', '#243044')
        .attr('stroke-width', 1.2);
      g.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', node.kind === 'external' ? '2.4em' : '0.35em')
        .attr('class', node.kind === 'external' ? 'viz-node-label viz-node-label-external' : 'viz-node-label')
        .text(node.label);
      g.append('title').text(node.title);
    }
  }, [nodes, snapshot, vertices, selectedCellId]);

  return (
    <div className="visualizer">
      <section className="panel">
        <h2>System Topology — Pentachoron (5-cell)</h2>
        <p className="panel-hint">
          Petrie-polygon projection: 5 vertices, 10 Rn edges (pentagon perimeter + pentagram diagonals),
          10 triadic faces, 5 tetrahedral cells. Solid edges: Relational Wholes (Rn) — closed circuits
          through their pivot (red when imbalanced). Dashed edges: Projections (Pk) — open paths
          (green = revenue P1, orange = expenditure P2). Hover or pin a cell to highlight its 4 vertices
          and 6 edges.
        </p>
        <div className="cell-selector">
          {snapshot.pentachoron.cells.map((cell) => (
            <button
              key={cell.id}
              className={classNames('btn btn-sm cell-toggle', { active: pinnedCell === cell.id })}
              onMouseEnter={() => setHoveredCell(cell.id)}
              onMouseLeave={() => setHoveredCell(null)}
              onFocus={() => setHoveredCell(cell.id)}
              onBlur={() => setHoveredCell(null)}
              onClick={() => setPinnedCell((current) => (current === cell.id ? null : cell.id))}
              title={`${cell.description} — omits ${cell.omits}`}
            >
              {cell.short} · {cell.name}
            </button>
          ))}
        </div>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="viz-svg"
          role="img"
          aria-label="Cosmos System 5 pentachoral topology of Rn and Pk flows"
        />
        <div className="viz-legend">
          {Object.values(vertices).map((vertex) => (
            <span key={vertex.id} className="legend-item">
              <span className="legend-swatch" style={{ background: vertex.color }} /> {vertex.label ?? vertex.name}
            </span>
          ))}
          <span className="legend-item"><span className="legend-line solid" /> Rn (closed)</span>
          <span className="legend-item"><span className="legend-line dashed" /> Pk (open)</span>
        </div>
      </section>
    </div>
  );
}
