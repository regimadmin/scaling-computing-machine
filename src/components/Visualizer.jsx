import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useSystemStore } from '../store/systemStore.js';

const WIDTH = 960;
const HEIGHT = 720;

const TRIAD_CENTERS = {
  cerebral: { x: WIDTH / 2, y: 195 },
  somatic: { x: 215, y: 540 },
  autonomic: { x: WIDTH - 215, y: 540 },
};

const SHARED_CORE = { x: WIDTH / 2, y: 435 };

const EXTERNAL_ANCHORS = {
  'external.gateway': { x: 150, y: 70 },
  'external.environment': { x: 70, y: 320 },
  'external.metrics': { x: WIDTH - 70, y: 320 },
  'external.responses': { x: WIDTH - 160, y: 130 },
};

/** Deterministic layout: services ring their triad center; shared/external nodes anchor the edges. */
function buildLayout(triads) {
  const nodes = new Map();

  for (const triad of Object.values(triads)) {
    const center = TRIAD_CENTERS[triad.id];
    const count = triad.services.length;
    triad.services.forEach((service, index) => {
      const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
      nodes.set(`${triad.id}.${service.code}`, {
        id: `${triad.id}.${service.code}`,
        label: service.code,
        title: `${triad.name} ${service.name} — ${service.role}`,
        x: center.x + 95 * Math.cos(angle),
        y: center.y + 95 * Math.sin(angle),
        color: triad.color,
        kind: 'service',
      });
    });
  }

  nodes.set('shared.P-5', {
    id: 'shared.P-5',
    label: 'P-5',
    title: 'Shared Processing Core — integration point for all triads',
    ...SHARED_CORE,
    color: '#b48ce0',
    kind: 'shared',
  });

  for (const [id, position] of Object.entries(EXTERNAL_ANCHORS)) {
    nodes.set(id, {
      id,
      label: id.replace('external.', ''),
      title: `External interface: ${id}`,
      ...position,
      color: '#8a94a6',
      kind: 'external',
    });
  }

  return nodes;
}

function pathThrough(points) {
  const line = d3.line().x((d) => d.x).y((d) => d.y).curve(d3.curveCatmullRom.alpha(0.7));
  return line(points);
}

/**
 * Visualizer — D3 topology of the tetrahedral System 5 architecture.
 * Solid edges are Relational Wholes (closed circuits, drawn through
 * their pivot); dashed edges are Projections (open paths through their
 * stages). Triads are color-coded per the analysis document.
 */
export default function Visualizer() {
  const svgRef = useRef(null);
  const triads = useSystemStore((state) => state.triads);
  const snapshot = useSystemStore((state) => state.snapshot);

  const nodes = useMemo(() => buildLayout(triads), [triads]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    defs
      .append('marker')
      .attr('id', 'arrow-rn')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#5f6c85');
    defs
      .append('marker')
      .attr('id', 'arrow-pk')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#9aa7bd');

    // Triad regions.
    const regions = svg.append('g');
    for (const triad of Object.values(triads)) {
      const center = TRIAD_CENTERS[triad.id];
      regions
        .append('circle')
        .attr('cx', center.x)
        .attr('cy', center.y)
        .attr('r', 145)
        .attr('fill', triad.color)
        .attr('fill-opacity', 0.12)
        .attr('stroke', triad.color)
        .attr('stroke-opacity', 0.5);
      regions
        .append('text')
        .attr('x', center.x)
        .attr('y', center.y - 160)
        .attr('text-anchor', 'middle')
        .attr('class', 'viz-triad-label')
        .text(`${triad.name} — ${triad.polarity}`);
    }

    const resolve = (id) => nodes.get(id) ?? SHARED_CORE;

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
        .attr('opacity', 0.85)
        .append('title')
        .text(`${pk.id} (${pk.kind}): ${pk.stages.join(' → ')} — total ${pk.total.toFixed(2)}`);
    }

    // Rn flows: solid closed circuits drawn through their pivot.
    const rnGroup = svg.append('g');
    for (const rn of snapshot.rnFlows) {
      const points = [resolve(rn.serviceA), resolve(rn.pivot), resolve(rn.serviceB)];
      rnGroup
        .append('path')
        .attr('d', pathThrough(points))
        .attr('fill', 'none')
        .attr('stroke', rn.balanced ? '#5f6c85' : '#d9534f')
        .attr('stroke-width', rn.triad === 'cross' ? 2.6 : 2)
        .attr('marker-end', 'url(#arrow-rn)')
        .attr('marker-start', 'url(#arrow-rn)')
        .attr('opacity', 0.9)
        .append('title')
        .text(
          `${rn.id}: ${rn.serviceA} ⇄ ${rn.serviceB} (pivot ${rn.pivot}) — E_R1 ${rn.r1Energy.toFixed(2)} / E_R2 ${rn.r2Energy.toFixed(2)}`,
        );
    }

    // Nodes.
    const nodeGroup = svg.append('g');
    for (const node of nodes.values()) {
      const g = nodeGroup.append('g').attr('transform', `translate(${node.x},${node.y})`);
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
  }, [nodes, snapshot, triads]);

  return (
    <div className="visualizer">
      <section className="panel">
        <h2>System Topology</h2>
        <p className="panel-hint">
          Solid edges: Relational Wholes (Rn) — closed circuits through their pivot (red when imbalanced).
          Dashed edges: Projections (Pk) — open paths (green = revenue P1, orange = expenditure P2).
        </p>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="viz-svg"
          role="img"
          aria-label="Cosmos System 5 topology of Rn and Pk flows"
        />
        <div className="viz-legend">
          {Object.values(triads).map((triad) => (
            <span key={triad.id} className="legend-item">
              <span className="legend-swatch" style={{ background: triad.color }} /> {triad.name}
            </span>
          ))}
          <span className="legend-item"><span className="legend-swatch" style={{ background: '#b48ce0' }} /> Shared P-5</span>
          <span className="legend-item"><span className="legend-line solid" /> Rn (closed)</span>
          <span className="legend-item"><span className="legend-line dashed" /> Pk (open)</span>
        </div>
      </section>
    </div>
  );
}
