import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const modelPath = new URL('../docs/diagrams/system5-term-view-model.json', import.meta.url);

function loadModel() {
  return JSON.parse(readFileSync(modelPath, 'utf8'));
}

test('System 5 diagram model contains ten families and twenty oriented term records', () => {
  const model = loadModel();
  assert.deepEqual(model.families.map((family) => family.termId), [
    'T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9',
  ]);
  assert.equal(model.families.flatMap((family) => Object.values(family.variants)).length, 20);
});

test('diagram model keeps relation families declarative and outside runtime namespaces', () => {
  const model = loadModel();
  assert.equal(model.relations.cyclic.notation, 'R_n');
  assert.equal(model.relations.cyclic.status, 'proposed-view-grammar');
  assert.equal(model.relations.projection.notation, 'P_k');
  assert.equal(model.relations.projection.status, 'proposed-view-grammar');
  assert.deepEqual(
    model.relations.virtualImages.map((relation) => relation.notation),
    ['V_3,4', 'V_4,5', 'V_3,5'],
  );
  assert.ok(model.families.every((family) => family.runtimeMappings.length === 0));
});

test('passive and active are representational views rather than generated behavior', () => {
  const model = loadModel();
  assert.equal(model.views.passive.orientation, 'top');
  assert.equal(model.views.active.orientation, 'side');
  assert.equal(model.views.passive.behaviorDefined, false);
  assert.equal(model.views.active.behaviorDefined, false);
});

test('every diagram record is traceable to declared provenance', () => {
  const model = loadModel();
  const evidenceIds = new Set(model.provenance.evidence.map((record) => record.evidenceId));
  const assertEvidence = (record) => {
    assert.ok(record.evidenceIds.length > 0);
    assert.ok(record.evidenceIds.every((evidenceId) => evidenceIds.has(evidenceId)));
  };

  model.families.forEach(assertEvidence);
  model.interfaces.forEach(assertEvidence);
  assertEvidence(model.relations.cyclic);
  assertEvidence(model.relations.projection);
  model.relations.virtualImages.forEach(assertEvidence);
  Object.values(model.views).forEach(assertEvidence);

  for (const source of model.provenance.sources) {
    assert.ok(existsSync(new URL(`../${source.sourceFile}`, import.meta.url)), `missing ${source.sourceFile}`);
  }
});

test('generated passive and active views exist in PNG and SVG formats', () => {
  for (const relative of [
    '../docs/images/system5-passive-top-view.png',
    '../docs/images/system5-passive-top-view.svg',
    '../docs/images/system5-active-side-view.png',
    '../docs/images/system5-active-side-view.svg',
  ]) {
    assert.ok(existsSync(new URL(relative, import.meta.url)), `missing ${relative}`);
  }
});
