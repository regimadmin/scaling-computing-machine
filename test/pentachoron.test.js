import test from 'node:test';
import assert from 'node:assert/strict';

import {
  Pentachoron,
  combinations,
  TriadicSystem,
  PENTACHORON,
  PENTACHORAL_CYCLE,
  CROSS_TRIAD_RN_FLOWS,
  DEFAULT_RN_FLOWS,
  VERTICES,
  PENTACHORAL_DIMENSIONS,
  DIMENSIONS,
} from '../src/core/index.js';

test('combinations enumerates k-subsets in order', () => {
  assert.deepEqual(combinations(['a', 'b', 'c'], 2), [
    ['a', 'b'],
    ['a', 'c'],
    ['b', 'c'],
  ]);
  assert.equal(combinations([1, 2, 3, 4, 5], 3).length, 10);
});

test('pentachoron satisfies the 4-simplex invariants: 5 vertices, 10 edges, 10 faces, 5 cells', () => {
  const penta = new Pentachoron(PENTACHORON);
  assert.equal(penta.vertices.length, 5);
  assert.equal(penta.edges.length, 10);
  assert.equal(penta.faces.length, 10);
  assert.equal(penta.cells.length, 5);

  // Every vertex pair is covered by exactly one edge.
  for (const [a, b] of combinations(penta.vertices, 2)) {
    assert.ok(penta.getEdgeBetween(a, b), `missing edge ${a}-${b}`);
  }

  // Each cell omits exactly one distinct vertex.
  const omitted = penta.cells.map((cell) => cell.omits);
  assert.equal(new Set(omitted).size, 5);
  for (const cell of penta.cells) {
    assert.equal(cell.vertices.length, 4);
    assert.ok(!cell.vertices.includes(cell.omits));
    assert.equal(cell.rnIds.length, 6, `cell ${cell.id} must have C(4,2)=6 edges`);
  }

  // Each edge belongs to exactly 3 of the 5 cells.
  for (const edge of penta.edges) {
    assert.equal(penta.cellsContainingEdge(edge.id).length, 3);
  }
});

test('pentachoron derives faces and cells combinatorially when omitted', () => {
  const penta = new Pentachoron({ vertices: PENTACHORON.vertices, edges: PENTACHORON.edges });
  assert.equal(penta.faces.length, 10);
  assert.equal(penta.cells.length, 5);
  for (const cell of penta.cells) {
    assert.equal(cell.omits, PENTACHORON.vertices.find((v) => !cell.vertices.includes(v)));
  }
});

test('pentachoron validation rejects malformed topologies', () => {
  assert.throws(
    () => new Pentachoron({ vertices: PENTACHORON.vertices, edges: PENTACHORON.edges.slice(0, 9) }),
    /C\(5,2\)=10 edges/,
  );
  assert.throws(
    () => new Pentachoron({ vertices: ['a', 'a', 'b', 'c', 'd'], edges: PENTACHORON.edges }),
    /unique/,
  );
});

test('the original [3-6-9] loop survives as the C-S-A face', () => {
  const penta = new Pentachoron(PENTACHORON);
  const face = penta.getFace('F_CSA');
  assert.ok(face);
  assert.deepEqual(face.vertices, ['cerebral', 'somatic', 'autonomic']);
  assert.deepEqual([...face.rnIds].sort(), ['R_AC', 'R_CS', 'R_SA']);
});

test('every pentachoral edge maps to a registered default Rn spec with distinct services and a pivot', () => {
  const specById = new Map(
    [...DEFAULT_RN_FLOWS, ...CROSS_TRIAD_RN_FLOWS].map((spec) => [spec.id, spec]),
  );
  for (const edge of PENTACHORON.edges) {
    const spec = specById.get(edge.rn);
    assert.ok(spec, `edge ${edge.id} references unknown Rn ${edge.rn}`);
    assert.notEqual(spec.serviceA, spec.serviceB);
    assert.ok(spec.pivot);
  }
});

test('the staggered cycle covers all five cells: phases 0–3 active, phase 4 rest', () => {
  assert.equal(PENTACHORAL_CYCLE.length, 5);
  const cellIds = PENTACHORAL_CYCLE.map((phase) => phase.cell);
  assert.equal(new Set(cellIds).size, 5);
  assert.deepEqual(PENTACHORAL_CYCLE.map((phase) => phase.mode), ['active', 'active', 'active', 'active', 'rest']);
  const penta = new Pentachoron(PENTACHORON);
  for (const phase of PENTACHORAL_CYCLE) {
    assert.ok(penta.getCell(phase.cell), `phase ${phase.phase} names unknown cell ${phase.cell}`);
  }
});

test('vertices and dimensions extend the tetrahedral definitions additively', () => {
  assert.deepEqual(Object.keys(VERTICES), ['cerebral', 'somatic', 'autonomic', 'integration', 'environmental']);
  assert.equal(VERTICES.integration.services[0].id, 'shared.P-5');
  assert.deepEqual(
    PENTACHORAL_DIMENSIONS.map((d) => d.id),
    [...DIMENSIONS.map((d) => d.id), 'E-I'],
  );
});

test('stepCycle activates the cell assigned to t mod 5 and flows only its six edges', () => {
  const system = new TriadicSystem();
  const activation = system.stepCycle(1);

  assert.equal(activation.step, 0);
  assert.equal(activation.phase, 0);
  assert.equal(activation.mode, 'active');
  assert.equal(activation.cell, 'cognitive-core');
  assert.equal(activation.edges.length, 6);
  assert.deepEqual([...activation.edges].sort(), ['R_AC', 'R_AI', 'R_CI', 'R_CS', 'R_SA', 'R_SI']);

  // Edges of the activated cell carry countercurrent energy…
  for (const rnId of activation.edges) {
    const rn = system.getRnFlow(rnId);
    assert.equal(rn.r1Energy, 1);
    assert.equal(rn.r2Energy, 1);
    assert.ok(rn.balanced);
  }
  // …while edges outside the cell (environmental) remain untouched.
  for (const rnId of ['R_CE', 'R_SE', 'R_AE', 'R_IE']) {
    const rn = system.getRnFlow(rnId);
    assert.equal(rn.r1Energy, 0);
    assert.equal(rn.r2Energy, 0);
  }
});

test('the rest step performs global rebalance without flowing energy', () => {
  const system = new TriadicSystem();
  for (let i = 0; i < 4; i += 1) system.stepCycle(1); // advance to t=4 keeping balance

  system.getRnFlow('R_CS').forwardFlow(15); // exceed the balance threshold
  assert.ok(!system.getRnFlow('R_CS').balanced);

  const rest = system.stepCycle(1);

  assert.equal(rest.phase, 4);
  assert.equal(rest.mode, 'rest');
  assert.equal(rest.cell, 'integrative-rest');
  assert.deepEqual(rest.edges, []);
  assert.deepEqual(rest.projections, []);
  assert.equal(rest.rebalanced, system.listRnFlows().length);
  assert.ok(system.getRnFlow('R_CS').balanced);
});

test('a full 5-step round touches every cell and preserves countercurrent balance', () => {
  const system = new TriadicSystem();
  const cells = new Set();
  for (let t = 0; t < 5; t += 1) {
    cells.add(system.stepCycle(1).cell);
  }
  assert.equal(cells.size, 5);
  assert.ok(system.listRnFlows().every((rn) => rn.balanced));

  const snap = system.snapshot();
  assert.ok(!snap.balanceSheet.deficit);
  assert.equal(snap.cycle.step, 5);
  assert.equal(snap.cycle.phase, 0);
  assert.ok(snap.pentachoron.balanced);
});

test('snapshot exposes pentachoral topology with per-cell metrics and cycle phase', () => {
  const system = new TriadicSystem();
  const snap = system.snapshot();

  assert.deepEqual(snap.pentachoron.vertices, PENTACHORON.vertices);
  assert.equal(snap.pentachoron.edges.length, 10);
  assert.equal(snap.pentachoron.faces.length, 10);
  assert.equal(snap.pentachoron.cells.length, 5);
  assert.equal(snap.cycle.step, 0);
  assert.equal(snap.cycle.lastActivation, null);
  assert.equal(snap.cycle.phases.length, 5);

  for (const cell of snap.pentachoron.cells) {
    assert.equal(typeof cell.imbalance, 'number');
    assert.equal(typeof cell.balanced, 'boolean');
    assert.equal(typeof cell.phase, 'number');
    assert.ok(['active', 'rest'].includes(cell.mode));
  }

  // An above-threshold one-sided flow on R_CE surfaces in exactly the 3 cells containing that edge.
  system.getRnFlow('R_CE').forwardFlow(12);
  const after = system.snapshot();
  const affected = after.pentachoron.cells.filter((cell) => !cell.balanced);
  assert.equal(affected.length, 3);
  for (const cell of affected) {
    assert.ok(cell.rnIds.includes('R_CE'));
    assert.equal(cell.imbalance, 12);
  }
});
