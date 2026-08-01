import { PENTACHORON } from './constants.js';

/** All k-element combinations of items, preserving input order. */
export function combinations(items, k) {
  if (k === 0) return [[]];
  if (items.length < k) return [];
  const [head, ...rest] = items;
  return [
    ...combinations(rest, k - 1).map((combo) => [head, ...combo]),
    ...combinations(rest, k),
  ];
}

/** Order-independent key for a vertex subset. */
const subsetKey = (vertices) => [...vertices].sort().join('|');

/** Normalize a collection of RelationalWholes (Map, array or plain JSON) to a Map by id. */
function toRnMap(rnFlows) {
  if (rnFlows instanceof Map) return rnFlows;
  const map = new Map();
  for (const rn of rnFlows ?? []) {
    map.set(rn.id, rn);
  }
  return map;
}

/**
 * Pentachoron — pure topology logic for the 5-cell (4-simplex)
 * enhancement of System 5.
 *
 * Wraps a topology spec ({vertices, edges, faces?, cells?}), deriving
 * faces/cells combinatorially when omitted, validating the simplex
 * invariants (5 vertices → C(5,2)=10 edges covering every vertex pair,
 * C(5,3)=10 faces, C(5,4)=5 cells each omitting exactly one vertex,
 * every edge shared by exactly 3 cells) and computing per-face and
 * per-cell aggregate metrics from a set of RelationalWhole instances.
 */
export class Pentachoron {
  constructor(topology = PENTACHORON) {
    const { vertices, edges, faces, cells } = topology;
    this.vertices = [...vertices];
    this.edges = edges.map((edge) => ({ ...edge, vertices: [...edge.vertices] }));
    this.faces = (faces ?? this.deriveFaces()).map((face) => ({
      ...face,
      vertices: [...face.vertices],
      rnIds: this.edgesWithin(face.vertices).map((edge) => edge.rn),
    }));
    this.cells = (cells ?? this.deriveCells()).map((cell) => ({
      ...cell,
      vertices: [...cell.vertices],
      rnIds: this.edgesWithin(cell.vertices).map((edge) => edge.rn),
    }));
    this.validate();
  }

  /** Derive the C(n,3) triadic faces from the vertex list. */
  deriveFaces() {
    return combinations(this.vertices, 3).map((vertices) => ({
      id: `F_${vertices.map((v) => v[0].toUpperCase()).join('')}`,
      vertices,
    }));
  }

  /** Derive the C(n,4) tetrahedral cells, each identified by its omitted vertex. */
  deriveCells() {
    return combinations(this.vertices, this.vertices.length - 1).map((vertices) => {
      const omits = this.vertices.find((vertex) => !vertices.includes(vertex));
      return { id: `cell-sans-${omits}`, omits, vertices };
    });
  }

  /** Assert the 4-simplex invariants; throws on any violation. */
  validate() {
    const n = this.vertices.length;
    if (new Set(this.vertices).size !== n) {
      throw new Error('Pentachoron vertices must be unique');
    }
    const expectedEdges = (n * (n - 1)) / 2;
    if (this.edges.length !== expectedEdges) {
      throw new Error(`Pentachoron requires C(${n},2)=${expectedEdges} edges, got ${this.edges.length}`);
    }
    const edgeKeys = new Set(this.edges.map((edge) => subsetKey(edge.vertices)));
    const expectedPairs = combinations(this.vertices, 2).map(subsetKey);
    if (edgeKeys.size !== expectedEdges || !expectedPairs.every((key) => edgeKeys.has(key))) {
      throw new Error('Pentachoron edges must cover every vertex pair exactly once');
    }
    const expectedFaces = (n * (n - 1) * (n - 2)) / 6;
    const faceKeys = new Set(this.faces.map((face) => subsetKey(face.vertices)));
    if (this.faces.length !== expectedFaces || faceKeys.size !== expectedFaces) {
      throw new Error(`Pentachoron requires C(${n},3)=${expectedFaces} distinct faces, got ${this.faces.length}`);
    }
    if (this.cells.length !== n) {
      throw new Error(`Pentachoron requires C(${n},${n - 1})=${n} cells, got ${this.cells.length}`);
    }
    const omitted = new Set();
    for (const cell of this.cells) {
      const missing = this.vertices.filter((vertex) => !cell.vertices.includes(vertex));
      if (cell.vertices.length !== n - 1 || missing.length !== 1) {
        throw new Error(`Cell '${cell.id}' must contain exactly ${n - 1} of ${n} vertices`);
      }
      if (cell.omits && cell.omits !== missing[0]) {
        throw new Error(`Cell '${cell.id}' declares omitted vertex '${cell.omits}' but omits '${missing[0]}'`);
      }
      omitted.add(missing[0]);
    }
    if (omitted.size !== n) {
      throw new Error('Each pentachoron cell must omit a distinct vertex');
    }
    for (const edge of this.edges) {
      const containing = this.cellsContainingEdge(edge.id);
      if (containing.length !== n - 2) {
        throw new Error(`Edge '${edge.id}' must belong to exactly ${n - 2} cells, got ${containing.length}`);
      }
    }
  }

  /** Edges whose endpoints both lie within the given vertex subset. */
  edgesWithin(vertexSubset) {
    return this.edges.filter((edge) => edge.vertices.every((vertex) => vertexSubset.includes(vertex)));
  }

  /** The edge connecting two vertices, if any. */
  getEdgeBetween(a, b) {
    return this.edges.find((edge) => subsetKey(edge.vertices) === subsetKey([a, b])) ?? null;
  }

  getFace(id) {
    return this.faces.find((face) => face.id === id) ?? null;
  }

  getCell(id) {
    return this.cells.find((cell) => cell.id === id) ?? null;
  }

  /** Cells containing the edge referenced by edge id or Rn flow id. */
  cellsContainingEdge(ref) {
    const edge = this.edges.find((candidate) => candidate.id === ref || candidate.rn === ref);
    if (!edge) return [];
    return this.cells.filter((cell) => edge.vertices.every((vertex) => cell.vertices.includes(vertex)));
  }

  /** Aggregate Rn metrics (imbalance, balanced) over a vertex-subset element. */
  #metricsFor(element, rnMap) {
    const present = element.rnIds.map((id) => rnMap.get(id)).filter(Boolean);
    return {
      ...element,
      imbalance: present.reduce((sum, rn) => sum + rn.imbalance, 0),
      balanced: present.every((rn) => rn.balanced),
      edgeCount: present.length,
      missingEdges: element.rnIds.length - present.length,
    };
  }

  /** Per-face aggregate metrics from RelationalWhole instances (Map or array). */
  faceMetrics(rnFlows) {
    const rnMap = toRnMap(rnFlows);
    return this.faces.map((face) => this.#metricsFor(face, rnMap));
  }

  /** Per-cell aggregate metrics from RelationalWhole instances (Map or array). */
  cellMetrics(rnFlows) {
    const rnMap = toRnMap(rnFlows);
    return this.cells.map((cell) => this.#metricsFor(cell, rnMap));
  }
}
