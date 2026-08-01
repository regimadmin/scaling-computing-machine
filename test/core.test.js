import test from 'node:test';
import assert from 'node:assert/strict';

import {
  RelationalWhole,
  Projection,
  AccountingSystem,
  TriadicSystem,
  TRIADS,
  DEFAULT_RN_FLOWS,
  CROSS_TRIAD_RN_FLOWS,
  DEFAULT_PK_FLOWS,
  DIMENSIONS,
  COGNITIVE_TOPOLOGY,
} from '../src/core/index.js';

test('RelationalWhole forms a closed circuit through the pivot', () => {
  const rn = new RelationalWhole({
    id: 'R_test',
    name: 'Test',
    serviceA: 'cerebral.T-7',
    serviceB: 'cerebral.O-4',
    pivot: 'cerebral.PD-2',
  });

  const forward = rn.forwardFlow(5);
  assert.deepEqual(forward.path, ['cerebral.T-7', 'cerebral.PD-2', 'cerebral.O-4']);

  const backward = rn.backwardFlow(5);
  assert.deepEqual(backward.path, ['cerebral.O-4', 'cerebral.PD-2', 'cerebral.T-7']);

  // The circuit closes: R2 ends where R1 begins.
  assert.equal(backward.path.at(-1), forward.path[0]);
  assert.equal(rn.r1Energy, 5);
  assert.equal(rn.r2Energy, 5);
  assert.equal(rn.imbalance, 0);
  assert.ok(rn.balanced);
});

test('RelationalWhole detects and restores countercurrent imbalance', () => {
  const rn = new RelationalWhole({
    id: 'R_test',
    serviceA: 'a',
    serviceB: 'b',
    pivot: 'p',
    threshold: 10,
  });

  rn.forwardFlow(30);
  assert.equal(rn.imbalance, 30);
  assert.equal(rn.balanced, false);

  const imbalance = rn.checkBalance();
  assert.equal(imbalance, 30);
  // Flows settle on their mean, restoring |E_R1| ≈ |E_R2|.
  assert.equal(rn.r1Energy, 15);
  assert.equal(rn.r2Energy, 15);
  assert.ok(rn.balanced);
});

test('RelationalWhole requires two distinct coalescing services', () => {
  assert.throws(
    () => new RelationalWhole({ id: 'R_bad', serviceA: 'x', serviceB: 'x', pivot: 'p' }),
    /distinct services/,
  );
  assert.throws(() => new RelationalWhole({ id: 'R_bad2', serviceA: 'x', serviceB: 'y' }), /pivot/);
});

test('RelationalWhole rejects non-positive flow energy', () => {
  const rn = new RelationalWhole({ id: 'R_e', serviceA: 'a', serviceB: 'b', pivot: 'p' });
  assert.throws(() => rn.forwardFlow(0), /positive/);
  assert.throws(() => rn.backwardFlow(-3), /positive/);
});

test('RelationalWhole round-trips through JSON', () => {
  const rn = new RelationalWhole({ id: 'R_j', serviceA: 'a', serviceB: 'b', pivot: 'p', triad: 'cerebral' });
  rn.forwardFlow(4);
  const restored = RelationalWhole.fromJSON(JSON.parse(JSON.stringify(rn)));
  assert.equal(restored.id, 'R_j');
  assert.equal(restored.r1Energy, 4);
  assert.equal(restored.triad, 'cerebral');
});

test('Projection flows unidirectionally and logs every stage to the ledger', () => {
  const p1 = new Projection({
    id: 'P1',
    name: 'Revenue',
    kind: 'revenue',
    stages: ['environment', 'body', 'cells', 'electronic'],
  });

  const entries = p1.flow(3);
  assert.equal(entries.length, 4);
  assert.deepEqual(entries.map((e) => e.stage), ['environment', 'body', 'cells', 'electronic']);
  assert.equal(p1.ledger.length, 4);
  // Sink accumulation counts each flow once.
  assert.equal(p1.getTotal(), 3);

  p1.flow(2);
  assert.equal(p1.getTotal(), 5);
});

test('Projection rejects closed circuits (open paths only)', () => {
  assert.throws(
    () => new Projection({ id: 'P_bad', stages: ['a', 'b', 'a'] }),
    /open path/,
  );
  assert.throws(() => new Projection({ id: 'P_short', stages: ['a'] }), /two stages/);
  assert.throws(
    () => new Projection({ id: 'P_kind', stages: ['a', 'b'], kind: 'other' }),
    /revenue.*expenditure/,
  );
});

test('AccountingSystem balances revenue against expenditure', () => {
  const accounting = new AccountingSystem([
    new Projection({ id: 'P1', kind: 'revenue', stages: ['env', 'body', 'cells'] }),
    new Projection({ id: 'P2', kind: 'expenditure', stages: ['cells', 'electronic'] }),
  ]);

  accounting.get('P1').flow(10);
  accounting.get('P2').flow(4);

  const sheet = accounting.compareBalance();
  assert.deepEqual(sheet, { revenue: 10, expenditure: 4, balance: 6, deficit: false });
  assert.equal(accounting.contingencies.length, 0);
});

test('AccountingSystem triggers contingency on deficit', () => {
  let observed = null;
  const accounting = new AccountingSystem(
    [
      new Projection({ id: 'P1', kind: 'revenue', stages: ['env', 'cells'] }),
      new Projection({ id: 'P2', kind: 'expenditure', stages: ['cells', 'electronic'] }),
    ],
    (deficit) => {
      observed = deficit;
    },
  );

  accounting.get('P1').flow(2);
  accounting.get('P2').flow(9);

  const sheet = accounting.compareBalance();
  assert.equal(sheet.balance, -7);
  assert.equal(sheet.deficit, true);
  assert.equal(observed, 7);
  assert.equal(accounting.contingencies.length, 1);
});

test('TriadicSystem wires up the default System 5 architecture', () => {
  const system = new TriadicSystem();

  assert.deepEqual(Object.keys(system.triads), ['cerebral', 'somatic', 'autonomic']);
  assert.equal(system.listRnFlows().length, DEFAULT_RN_FLOWS.length + CROSS_TRIAD_RN_FLOWS.length);
  assert.equal(system.listPkFlows().length, DEFAULT_PK_FLOWS.length);

  // Cross-triad Rn flows pivot through the shared P-5 core.
  for (const id of ['R_CS', 'R_SA', 'R_AC']) {
    assert.equal(system.getRnFlow(id).pivot, 'shared.P-5');
  }
});

test('TriadicSystem processCycle keeps the system balanced', () => {
  const system = new TriadicSystem();
  const snapshot = system.processCycle(2);

  assert.equal(snapshot.totalImbalance, 0);
  assert.equal(snapshot.balanceSheet.deficit, false);
  assert.ok(snapshot.balanced);
  for (const rn of snapshot.rnFlows) {
    assert.equal(rn.r1Energy, 2);
    assert.equal(rn.r2Energy, 2);
  }
});

test('TriadicSystem supports custom Rn/Pk registration and removal', () => {
  const system = new TriadicSystem({ withDefaults: false });
  assert.equal(system.listRnFlows().length, 0);
  assert.equal(system.listPkFlows().length, 0);

  system.addRnFlow({ id: 'R_x', serviceA: 'a', serviceB: 'b', pivot: 'p' });
  system.addPkFlow({ id: 'P_x', kind: 'revenue', stages: ['a', 'b'] });
  assert.throws(() => system.addRnFlow({ id: 'R_x', serviceA: 'a', serviceB: 'b', pivot: 'p' }), /already registered/);
  assert.throws(() => system.addPkFlow({ id: 'P_x', kind: 'revenue', stages: ['a', 'b'] }), /already registered/);

  assert.ok(system.removeRnFlow('R_x'));
  assert.ok(system.removePkFlow('P_x'));
  assert.equal(system.getRnFlow('R_x'), null);
  assert.equal(system.getPkFlow('P_x'), null);
});

test('Architecture constants match the analysis document', () => {
  // Triad polarities: Potential / Commitment / Performance.
  assert.equal(TRIADS.cerebral.polarity, 'Potential');
  assert.equal(TRIADS.somatic.polarity, 'Commitment');
  assert.equal(TRIADS.autonomic.polarity, 'Performance');

  // Dimensional flows [D-T], [P-O], [S-M].
  assert.deepEqual(DIMENSIONS.map((d) => d.id), ['D-T', 'P-O', 'S-M']);

  // [3-6-9] closed cognitive loop.
  assert.deepEqual(COGNITIVE_TOPOLOGY, ['cerebral', 'somatic', 'autonomic']);

  // P-5 is shared by all triads.
  for (const triad of Object.values(TRIADS)) {
    assert.ok(triad.services.some((s) => s.code === 'P-5'), `${triad.name} must include P-5`);
  }
});
