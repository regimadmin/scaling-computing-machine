import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const modelPath = new URL('../docs/diagrams/system5-term-relation-model.json', import.meta.url);
const docPath = new URL('../docs/17 - Term Rn Pk Iij Technical Documentation.md', import.meta.url);

function loadModel() {
  return JSON.parse(readFileSync(modelPath, 'utf8'));
}

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];

function nthPrime(n) {
  assert.ok(n >= 1 && n <= PRIMES.length, `prime index ${n} out of range`);
  return PRIMES[n - 1];
}

function primeIndex(p) {
  const index = PRIMES.indexOf(p);
  assert.ok(index >= 0, `${p} is not a supported prime`);
  return index + 1;
}

function matulaOfForm(form) {
  // Matula-Goebel number of the rooted tree whose children are the
  // top-level parenthesis groups: M(tree) = product of p_{M(child)}.
  let matula = 1;
  let depth = 0;
  let start = 0;
  for (let i = 0; i < form.length; i += 1) {
    if (form[i] === '(') {
      if (depth === 0) {
        start = i;
      }
      depth += 1;
    } else if (form[i] === ')') {
      depth -= 1;
      assert.ok(depth >= 0, `unbalanced parentheses in ${form}`);
      if (depth === 0) {
        const child = matulaOfForm(form.slice(start + 1, i));
        matula *= nthPrime(child);
      }
    } else {
      assert.fail(`unexpected character in ${form}`);
    }
  }
  assert.equal(depth, 0, `unbalanced parentheses in ${form}`);
  return matula;
}

function matulaOfPrimeForm(primeForm) {
  const factors = primeForm.match(/p\d+/g) ?? [];
  let matula = 1;
  for (const factor of factors) {
    matula *= nthPrime(Number(factor.slice(1)));
  }
  return matula;
}

test('System 5 term relation model documents all twenty terms in series order', () => {
  const model = loadModel();
  assert.deepEqual(model.terms.map((term) => term.termToken), [
    'T1-1', 'T1-2', 'T1-3', 'T1-4', 'T1-5', 'T1-6', 'T1-7', 'T1-8', 'T1-9',
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9',
    'T2-5', 'T2-7',
  ]);
  const bySeries = new Map(model.series.map((series) => [series.seriesId, series.termTokens]));
  assert.equal(bySeries.get('subjective-autonomic').length, 9);
  assert.equal(bySeries.get('objective-somatic').length, 9);
  assert.equal(bySeries.get('transjective-universal').length, 2);
  for (const term of model.terms) {
    assert.ok(bySeries.get(term.seriesId).includes(term.termToken), `${term.termToken} missing from ${term.seriesId}`);
  }
});

test('relation grammar stays declarative and outside runtime namespaces', () => {
  const model = loadModel();
  assert.equal(model.status, 'proposed-interpretive-model');
  assert.equal(model.notation.cyclic.notation, 'R_n');
  assert.equal(model.notation.projection.notation, 'P_k');
  assert.equal(model.notation.virtualImage.notation, 'I_i,j');
  assert.ok(model.terms.every((term) => term.runtimeMappings.length === 0));
});

test('every term declares counter-current cyclic relations over valid interfaces', () => {
  const model = loadModel();
  const interfaceIds = new Set(model.interfaces.map((record) => record.id));
  const directions = new Set(['efferent', 'afferent', 'bipolar']);
  const statuses = new Set(['source-attested', 'interpretive']);
  for (const term of model.terms) {
    assert.ok(term.cyclicRelations.length >= 2, `${term.termToken} needs at least R1 and R2`);
    assert.deepEqual(
      term.cyclicRelations.slice(0, 2).map((relation) => relation.id),
      ['R1', 'R2'],
      `${term.termToken} must lead with the R1/R2 counter-current pair`,
    );
    for (const relation of term.cyclicRelations) {
      assert.match(relation.id, /^R\d+$/);
      assert.ok(directions.has(relation.direction), `${term.termToken} ${relation.id} direction`);
      assert.ok(statuses.has(relation.status), `${term.termToken} ${relation.id} status`);
      assert.ok(relation.path.length >= 2, `${term.termToken} ${relation.id} path too short`);
      assert.ok(relation.path.every((id) => interfaceIds.has(id)), `${term.termToken} ${relation.id} path`);
    }
  }
});

test('every term declares paired linear projections over valid interfaces', () => {
  const model = loadModel();
  const interfaceIds = new Set(model.interfaces.map((record) => record.id));
  const roles = new Set(['input', 'output']);
  for (const term of model.terms) {
    assert.ok(term.linearProjections.length >= 2, `${term.termToken} needs a projection pair`);
    for (const projection of term.linearProjections) {
      assert.match(projection.id, /^P\d+$/);
      assert.ok(roles.has(projection.role), `${term.termToken} ${projection.id} role`);
      assert.ok(projection.path.length >= 2, `${term.termToken} ${projection.id} path too short`);
      assert.ok(projection.path.every((id) => interfaceIds.has(id)), `${term.termToken} ${projection.id} path`);
    }
  }
});

test('virtual images are confined to the closed (3,4,5) triad pairs', () => {
  const model = loadModel();
  const statuses = new Set(['source-attested', 'structural', 'none-recorded']);
  const allowedPairs = new Set(['3,4', '4,5', '3,5']);
  for (const term of model.terms) {
    assert.ok(statuses.has(term.virtualImages.status), `${term.termToken} virtual image status`);
    for (const image of term.virtualImages.images) {
      const key = image.interfaces.join(',');
      assert.ok(allowedPairs.has(key), `${term.termToken} ${image.notation} pair`);
      assert.equal(image.notation, `I_${key}`, `${term.termToken} notation must match interfaces`);
    }
    if (term.virtualImages.status === 'none-recorded') {
      assert.equal(term.virtualImages.images.length, 0, `${term.termToken} records no images`);
    } else {
      assert.equal(term.virtualImages.images.length, 3, `${term.termToken} triad yields three images`);
    }
  }
});

test('source-attested virtual images cover T1-2 and T1-3 as the corpus requires', () => {
  const model = loadModel();
  const byToken = new Map(model.terms.map((term) => [term.termToken, term]));
  assert.equal(byToken.get('T1-2').virtualImages.status, 'source-attested');
  assert.equal(byToken.get('T1-3').virtualImages.status, 'source-attested');
  assert.equal(byToken.get('T2-5').virtualImages.status, 'structural');
  assert.equal(byToken.get('T2-7').virtualImages.status, 'structural');
  const openQuestionIds = model.openQuestions.map((question) => question.id);
  assert.ok(openQuestionIds.includes('OQ-001'), 'virtual-image trio question preserved');
  assert.ok(openQuestionIds.includes('OQ-002'), 'issue numbering divergence preserved');
});

test('structural signatures reproduce their Matula numbers and prime factorizations', () => {
  const model = loadModel();
  for (const term of model.terms) {
    const signature = term.structuralSignature;
    const opens = (signature.parenthesisForm.match(/\(/g) ?? []).length;
    const closes = (signature.parenthesisForm.match(/\)/g) ?? []).length;
    assert.equal(opens, 5, `${term.termToken} has five interfaces`);
    assert.equal(closes, 5, `${term.termToken} has five interfaces`);
    assert.equal(
      matulaOfForm(signature.parenthesisForm),
      signature.matulaNumber,
      `${term.termToken} parenthesis form must reproduce Matula number`,
    );
    assert.equal(
      matulaOfPrimeForm(signature.primeForm),
      signature.matulaNumber,
      `${term.termToken} prime form must reproduce Matula number`,
    );
  }
});

test('every term record is traceable to declared provenance', () => {
  const model = loadModel();
  const evidenceIds = new Set(model.provenance.evidence.map((record) => record.evidenceId));
  const sourceIds = new Set(model.provenance.sources.map((record) => record.sourceId));
  for (const record of model.provenance.evidence) {
    assert.ok(sourceIds.has(record.sourceId), `evidence ${record.evidenceId} source`);
  }
  const assertEvidence = (record, label) => {
    assert.ok(record.evidenceIds.length > 0, `${label} evidence`);
    assert.ok(record.evidenceIds.every((evidenceId) => evidenceIds.has(evidenceId)), `${label} evidence ids`);
  };
  model.terms.forEach((term) => assertEvidence(term, term.termToken));
  model.interfaces.forEach((record) => assertEvidence(record, `interface ${record.id}`));
  Object.entries(model.views).forEach(([name, record]) => assertEvidence(record, `view ${name}`));
  Object.entries(model.notation).forEach(([name, record]) => assertEvidence(record, `notation ${name}`));
  model.openQuestions.forEach((question) => assertEvidence(question, question.id));
  for (const source of model.provenance.sources) {
    assert.ok(existsSync(new URL(`../${source.sourceFile}`, import.meta.url)), `missing ${source.sourceFile}`);
  }
});

test('generated relation atlas sheets exist in PNG and SVG formats', () => {
  const model = loadModel();
  for (const view of Object.values(model.views)) {
    for (const extension of ['png', 'svg']) {
      const relative = `../docs/images/${view.imageBase}.${extension}`;
      assert.ok(existsSync(new URL(relative, import.meta.url)), `missing ${relative}`);
    }
  }
});

test('technical documentation covers every term token', () => {
  const model = loadModel();
  const doc = readFileSync(docPath, 'utf8');
  for (const term of model.terms) {
    const heading = `### ${term.termToken} `;
    assert.ok(doc.includes(heading), `docs/17 missing section for ${term.termToken}`);
  }
  assert.ok(doc.includes('R_n'), 'doc explains R_n grammar');
  assert.ok(doc.includes('P_k'), 'doc explains P_k grammar');
  assert.ok(doc.includes('I_3,4'), 'doc explains I_i,j grammar');
});
