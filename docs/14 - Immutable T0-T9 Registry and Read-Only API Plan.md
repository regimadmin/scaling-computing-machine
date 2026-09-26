# Immutable T0–T9 registry and read-only API implementation plan

_Proposed implementation sequence for the terminology registry defined by the [Provisional T0–T9 term specification](<13 - Provisional T0-T9 Term Specification.md>)._

---

## Status and outcome

**Status:** Ready for engineering review; no registry or API code is implemented by this plan.

The target outcome is an immutable, process-local JavaScript registry containing ten ordered families (`T0`–`T9`), twenty objective/subjective variant records, exact source-token evidence, all seven conflict records, and no executable term behavior. A read-only HTTP API will expose the same data without adding mutation, persistence, automatic aliasing, or mappings into the existing Rn, Pk, service, pentachoron, or cycle namespaces.

## Constraints

- The [provisional specification](<13 - Provisional T0-T9 Term Specification.md>) is the terminology contract.
- `src/core/constants.js` and current tests remain authoritative for executable topology and flow behavior.
- Exact tokens preserve zero padding, hyphens, case, and punctuation.
- One source token may resolve to multiple evidence records.
- Compound tokens remain atomic unless an adjudication explicitly declares a mapping.
- Unadjudicated collisions use the exact state `unresolved-pending-adjudication`.
- `runtimeMappings` is empty in the first release.
- The API exposes `GET` and `HEAD` only.
- No new dependency is required; use ECMAScript modules, Node's built-in test runner, Express, and the platform `fetch` API.
- Provenance and conflict tests precede implementation. They are not deferred until after the HTTP layer.

## Proposed architecture

| Component | Proposed path | Responsibility |
| --- | --- | --- |
| Evidence fixture | `src/concepts/system5TermEvidence.js` | Immutable exact-token evidence and source locations |
| Conflict fixture | `src/concepts/system5TermConflicts.js` | Stable `C-001`–`C-007` records and states |
| Registry module | `src/concepts/system5Terms.js` | Ordered family records, variants, exact-token multimap, and public query functions |
| Registry validator | `src/concepts/validateSystem5Terms.js` | Shape, provenance, conflict, namespace, and immutability invariants |
| Core export | `src/core/index.js` | Re-export the read-only conceptual API without merging data into runtime constants |
| API factory | `src/api/createApp.js` | Build an Express application with injected registry queries and existing runtime routes |
| Process entrypoint | `server.js` | Create the HTTP/WebSocket server and listen on the configured port |
| Unit tests | `test/system5Terms.test.js` | Registry, evidence, conflict, and immutability contracts |
| HTTP tests | `test/system5TermsApi.test.js` | Read-only routes, errors, ordering, and method rejection |
| Documentation tests | `test/documentation.test.js` | Local links, registry counts, conflict IDs, and namespace statements |

The registry lives under `src/concepts/`, not `src/core/constants.js`. This keeps terminology evidence separate from executable services, flows, topology, and scheduling.

## Registry shape

The module should export frozen records with this minimum shape:

```js
{
  schemaVersion: '0.1.0',
  registryId: 'sys5-term:T2',
  termId: 'T2',
  provisionalName: 'Idea Creation',
  status: 'provisional',
  semanticStatus: 'undefined',
  confidence: 'medium',
  confidenceRationale: 'Repeated family label with unresolved cross-references',
  variants: {
    objective: {
      variantId: 'sys5-term:T2:objective',
      token: 'T2O',
      crossReferences: ['T13', 'T2-1'],
    },
    subjective: {
      variantId: 'sys5-term:T2:subjective',
      token: 'T2S',
      crossReferences: ['T02', 'T1-2'],
    },
  },
  perspectives: {
    passive: { status: 'heading-only', evidenceIds: [] },
    active: { status: 'heading-only', evidenceIds: [] },
  },
  evidenceIds: [],
  conflictIds: [],
  adjudicationIds: [],
  runtimeMappings: [],
}
```

The module must maintain separate immutable stores:

- `SYSTEM5_TERM_FAMILIES`: exactly ten ordered records
- `SYSTEM5_TERM_EVIDENCE`: one record per source claim
- `SYSTEM5_TERM_CONFLICTS`: exactly seven initial conflict records
- `SOURCE_TOKEN_INDEX`: exact token to array of evidence IDs

The token index is a multimap. It must not select a first match or promote a cross-reference to an alias.

## Public module API

The initial module should expose only pure read and validation functions:

```js
listProvisionalTerms();
getProvisionalTerm(termId);
resolveSourceToken(exactToken);
listTermConflicts(termId);
listAllTermConflicts();
validateProvisionalTermRegistry(registry);
```

Required behavior:

- `listProvisionalTerms()` returns deterministic numeric order from `T0` to `T9`.
- `getProvisionalTerm()` accepts only exact unpadded family IDs.
- `resolveSourceToken()` performs exact lookup and returns all matching evidence records.
- Missing records return `null` from module lookups.
- Returned objects are deeply frozen, or independently deep-cloned and then frozen.
- No exported array, object, or nested property can mutate the canonical singleton.
- No function executes a term, advances a state, selects a mode, or maps a term to current runtime entities.

## Read-only HTTP API

Use a concept-specific namespace to avoid collision with current runtime routes:

| Method | Route | Result |
| --- | --- | --- |
| `GET`/`HEAD` | `/api/concepts/system5/terms` | Ordered ten-family collection with twenty nested variants |
| `GET`/`HEAD` | `/api/concepts/system5/terms/:termId` | One family record |
| `GET`/`HEAD` | `/api/concepts/system5/source-tokens/:token` | All exact-token evidence matches |
| `GET`/`HEAD` | `/api/concepts/system5/conflicts` | Seven conflict summaries |
| `GET`/`HEAD` | `/api/concepts/system5/conflicts/:conflictId` | One conflict and its evidence references |

Collection responses should use a stable envelope:

```json
{
  "schemaVersion": "0.1.0",
  "data": [],
  "meta": {
    "count": 10,
    "readOnly": true
  }
}
```

Error rules:

- Unknown family or conflict: `404` with a stable error code.
- Empty or malformed exact token: `400`.
- `POST`, `PUT`, `PATCH`, and `DELETE` below `/api/concepts/system5/`: `405` with `Allow: GET, HEAD`.
- Internal validation failure during startup: fail fast; do not serve a partial registry.

`resolveSourceToken()` must be URL-decoded exactly once. It must not trim, uppercase, remove zeroes, or split hyphenated tokens.

## Delivery phases

### Phase 0 — Confirm the contract

1. Review the ten family names and twenty O/S variant records.
2. Confirm that `C-001`–`C-007` remain represented.
3. Confirm that unresolved conflicts do not create canonical aliases.
4. Confirm that `runtimeMappings` remains empty.
5. Record approval as a terminology decision, not a behavioral decision.

**Exit gate:** Reviewers agree that the registry is evidence-preserving and non-executable.

### Phase 1 — Add provenance fixtures under RED tests

1. Create `test/system5Terms.test.js` with a missing-module import.
2. Add a failing count test for ten family records.
3. Add a failing count test for twenty objective/subjective variants.
4. Add a failing order test for `T0` through `T9`.
5. Add a failing test that `T02` resolves to every conflicting evidence record.
6. Add failing distinction tests for `T09` versus `T9`, `T08` versus `T8`, and `T06` versus `T6`.
7. Add a failing atomicity test for `T1-3`.
8. Add a failing test for all seven conflict IDs.
9. Add a failing test that all initial `runtimeMappings` arrays are empty.
10. Run only `test/system5Terms.test.js` and confirm each failure is caused by missing registry behavior.

**Exit gate:** The RED suite proves the expected contract can fail.

### Phase 2 — Implement evidence and conflict fixtures

1. Create one frozen evidence record per normative evidence-matrix row.
2. Preserve exact source tokens and deterministic evidence IDs.
3. Store source file, printed page or section, source layer, statement, confidence, and conflict IDs.
4. Create `C-001`–`C-007` with evidence references and resolution state.
5. Validate that every conflict evidence ID exists.
6. Run the focused unit suite.

**Exit gate:** Evidence and conflict fixtures satisfy their tests without adding registry queries.

### Phase 3 — Implement the immutable family registry

1. Create the ten family records in numeric order.
2. Attach one objective and one subjective variant to every family.
3. Build `SOURCE_TOKEN_INDEX` from evidence records rather than hand-maintaining a second mapping.
4. Reject duplicate evidence IDs during module initialization.
5. Allow duplicate exact tokens in the multimap.
6. Implement recursive freezing for arrays and plain objects.
7. Export only frozen records and pure query functions.
8. Add mutation-attempt tests for top-level records, nested variants, evidence arrays, and conflict arrays.
9. Run the focused unit suite.

**Exit gate:** All registry tests are GREEN and a mutation cannot affect later reads.

### Phase 4 — Implement validation

1. Validate exactly ten ordered family IDs.
2. Validate exactly twenty O/S variant records.
3. Validate namespaced `registryId` values.
4. Validate every cross-reference against evidence.
5. Validate token-significant zero padding and hyphens.
6. Validate that collisions remain arrays with complete evidence.
7. Validate all conflict references.
8. Validate perspective states.
9. Validate empty runtime mappings.
10. Return diagnostics naming the record, field, rejected value, and violated rule.
11. Add one failing test per validator rule before implementing that rule.

**Exit gate:** The canonical fixture validates, and one mutated fixture fails for each invariant.

### Phase 5 — Make the server testable without changing behavior

1. Add characterization tests for every current REST endpoint's method, status, response shape, and representative error.
2. Extract Express application creation into `src/api/createApp.js` with injected `TriadicSystem` and registry queries.
3. Keep WebSocket creation and listening in `server.js`.
4. Add WebSocket characterization for initial connection snapshots and mutation-triggered broadcasts.
5. Preserve every existing runtime route and response.
6. Start test servers on port `0` and obtain the assigned port from `server.address()`.
7. Run the existing and characterization suites.

**Exit gate:** Current API behavior is unchanged and tests can create and close an ephemeral server.

### Phase 6 — Add the read-only registry routes

1. Add a failing list-route test.
2. Implement `GET /api/concepts/system5/terms`.
3. Add a failing detail-route test.
4. Implement exact family lookup and `404` response.
5. Add a failing token-collision route test.
6. Implement exact-token lookup returning all matches.
7. Add failing conflict list and detail tests.
8. Implement conflict routes.
9. Add failing mutation-method tests.
10. Add failing `HEAD` tests for all five resource shapes and verify an empty body with the matching `GET` status and headers.
11. Add exact-once URL-decoding tests for encoded hyphens, encoded percent signs, invalid escapes, and double-encoded input.
12. Implement the `405` boundary and the exact `Allow: GET, HEAD` header before any catch-all `404` route.
13. Verify that registry reads do not broadcast WebSocket snapshots.

**Exit gate:** All registry HTTP tests are GREEN and existing runtime APIs remain unchanged.

### Phase 7 — Document and integrate

1. Add module examples to `README.md`.
2. Add the five read-only routes to the API table.
3. Link the implementation to the provisional specification and conflict report.
4. Document the four namespaces: registry family, source token, compound source token, and pentachoron cell.
5. Document that conceptual Rn/Pk/V notation is not a runtime mapping.
6. Add documentation-contract tests for local links and required boundary language.
7. Run Markdown lint.

**Exit gate:** A new maintainer can find the specification, query API, and namespace boundary from the README.

### Phase 8 — Final verification and review

1. Run `npm ci` from the lock file.
2. Run the focused registry tests three times.
3. Run the HTTP tests three times to expose lifecycle leaks.
4. Run the full test suite.
5. Run the production build.
6. Regenerate and render all source-controlled diagrams.
7. Run the deliverable manifest validator for source links, evidence/conflict coverage, required boundaries, and expected artifacts.
8. Run structural Markdown lint.
9. Run `git diff --check`.
10. Search changed lines for secrets and accidental absolute paths.
11. Review that no mutation route, persistence layer, dependency, or runtime mapping was introduced.
12. Request terminology and API review separately.

**Exit gate:** All automated checks pass and both reviewers approve their separate scopes.

## Test matrix

| Requirement | Test behavior | Expected result |
| --- | --- | --- |
| Family count | Count ordered family records | `10` |
| Variant count | Count objective and subjective variants | `20` |
| Exact order | Read family IDs | `T0` through `T9` |
| Duplicate token | Resolve `T02` | Multiple evidence records retained |
| Zero padding | Compare `T09` and `T9` | Distinct lookups |
| Atomic compound | Resolve `T1-3` | Exact compound record only |
| Unknown token | Resolve an absent token | Empty array |
| Unknown family | Module and HTTP lookup | `null` and `404` |
| Conflict coverage | Read conflict IDs | `C-001` through `C-007` |
| Deep immutability | Attempt nested mutation | Throws or has no effect |
| Runtime boundary | Inspect all records | Every `runtimeMappings` array is empty |
| Stable serialization | Repeat list request | Byte-equivalent JSON body, excluding transport headers |
| Read-only API | Send four mutation methods | `405` and `Allow: GET, HEAD` |
| HEAD parity | Send `HEAD` to every read route | Matching `GET` status/headers and empty body |
| Exact-once decoding | Request encoded hyphen, percent, invalid, and double-encoded tokens | One decode only; no normalization or accidental second match |
| WebSocket isolation | Read registry endpoints | No runtime snapshot broadcast |
| Current API characterization | Exercise every pre-existing route and WebSocket event | Status and response shape unchanged |
| Startup validation | Inject invalid fixture | Server fails before listening |

## Migration and compatibility

This is an additive feature. Existing imports, Rn/Pk routes, pentachoron data, UI state, and persisted runtime snapshots do not change.

Potential collision points:

- `T1`–`T4` already label pentachoron cells.
- `T-7`, `P-5`, and related service codes resemble term tokens but belong to the service namespace.
- Existing Rn/Pk identifiers describe executable flows, not source-term relations.

Use namespaced external identifiers everywhere. Do not rename current runtime IDs in this change.

## Rollback

If the registry or API causes a regression:

1. Remove the conceptual exports and `/api/concepts/system5/` routes.
2. Restore the prior `server.js` entrypoint.
3. Keep the source evidence, specification, and conflict report in documentation.
4. Run the existing test suite and build.

Rollback must not delete or rewrite evidence records. The terminology corpus remains useful even if the API is withdrawn.

## Acceptance gates

The implementation is ready to merge only when:

- Ten ordered family records and twenty variants are present.
- All seven conflicts are queryable.
- Exact-token collisions return complete result sets.
- Zero-padded and compound tokens remain distinct.
- All returned data is deeply immutable.
- Every API under the concept namespace is read-only.
- Runtime mappings remain empty.
- Existing runtime APIs and tests are unchanged.
- Documentation links, Markdown lint, full tests, build, and whitespace checks pass.

## Deferred decisions

The following work is explicitly outside this implementation:

- Behavioral semantics for any T0–T9 family
- Passive-to-active transitions
- Objective-to-subjective transitions
- Executable Rn, Pk, or virtual-image mappings
- Adjudication of `T02`, `T05`/`T07`, or `T20`
- Persistence, mutation, user interface, search ranking, or authorization
- A runtime adapter between term families and pentachoron cells
