# T0–T9 conflict-resolution analysis

_Automated seven-agent evidence review of `C-001` through `C-007`, synthesized on 2026-09-26 against the provisional specification, guided source corpus, curated source notes, uploaded supporting material, and current runtime constants._

---

## Executive summary

The analysis resolves **four registry-handling questions by non-semantic rule** and leaves **three terminology questions pending authorized adjudication**. `C-003`, `C-005`, and `C-006` are resolved through cross-reference, namespace, and atomic-token rules. `C-007` is resolved only for safe representation: passive and active remain heading-level metadata, while diagrams may present explicitly declared view grammar without claiming behavior. `C-001`, `C-002`, and `C-004` remain unresolved because the available evidence supplies no erratum, precedence rule, or authorized decision maker.

No conflict disposition authorizes executable System 5 behavior. Exact-token lookup must return complete evidence sets. Zero padding and hyphens remain significant. Source layers remain separate. All initial `runtimeMappings` arrays remain empty.

## Method

The review used eight deterministic agent calls:

1. One independent reviewer for each conflict class
2. One synthesis reviewer over all seven structured results

Each reviewer received the same source packet and prior specification. Every result had to identify exact evidence, alternatives, a disposition, a resolution state, registry rules, tests, runtime boundary, and confidence. The synthesis used source layering and exact-token preservation rather than majority voting.

### Resolution states

| State | Meaning |
| --- | --- |
| `resolved-by-rule` | A representation, parsing, or namespace invariant prevents information loss without choosing source meaning |
| `unresolved-pending-adjudication` | A canonical terminology choice requires an authorized decision |
| `semantic-status-unresolved` | A safe representation exists, but no operational meaning is defined |

## Resolution matrix

| Conflict | Class | State | Disposition | Blocking decision |
| --- | --- | --- | --- | --- |
| `C-001` | Duplicate `T02` | Unresolved | Preserve all `T02` evidence; no preference | Decide whether any p. 2 association is erroneous or superseded |
| `C-002` | `T05`/`T07` reversal | Unresolved | Keep four transfer tokens separate from T0 | Adjudicate Goal/Discretion associations from raw cited pages |
| `C-003` | Unknown numbered records | Resolved by rule | Store named pairings as cross-references, not aliases | None |
| `C-004` | Later title divergence | Unresolved | Retain later titles as secondary evidence | Decide title precedence, especially for `T20` |
| `C-005` | System 4 contextual reuse | Resolved by rule | Isolate in `sys4-context:` namespace | Only missing individual p. 3 assignments remain open |
| `C-006` | Asymmetric compounds | Resolved by rule | Treat compounds as atomic; link only by explicit evidence | None |
| `C-007` | Passive/active under-specification | Representation resolved | Use heading-only metadata and labelled view grammar | Behavioral meaning requires a new specification |

## C-001 — Duplicate `T02` cross-reference

### Evidence

| Token | Source location | Layer | Statement |
| --- | --- | --- | --- |
| `T02` | Corpus p. 2 | Inventory | `T02 – 1S – Need Perception` |
| `T02` | Corpus p. 2 | Inventory | `T02 – 2S – Idea Creation` |
| `T01` | Corpus p. 5 | O/S crosswalk | Paired with `T1S` / Need Perception |
| `T02` | Corpus p. 5 | O/S crosswalk | Paired with `T2S` / Idea Creation |

The p. 5 crosswalk is locally coherent, but no supplied erratum says that it corrects or supersedes p. 2. A later source layer cannot silently replace an earlier one.

### Disposition

**State:** `unresolved-pending-adjudication`

`resolveSourceToken('T02')` must return the complete three-record evidence set: both p. 2 inventory records and the p. 5 crosswalk record. A caller may filter by source layer, but filtering cannot change the conflict state or hide evidence from an unfiltered lookup.

### Regression rules

- `T01` and `T02` are exact, distinct strings.
- No first-match or preferred-family result is permitted.
- Every result retains file, page, layer, statement, and `C-001`.
- A future adjudication must name its authority, evidence, rationale, and superseded interpretation.

## C-002 — `T05`/`T07` transfer reversal and T0 adjacency

### Evidence

The prior conflict register reports reversed Goal Transfer and Discretion Transfer associations across `T05`, `T07`, `T0-5`, and `T0-7` on corpus pp. 2, 5, 17, and 18. The later [term descriptions](../system5-term-descriptions.md) give one interpretive arrangement: `T2-5 — Discretion Transfer (T05)` and `T2-7 — Goal Transfer (T07)`. That later layer does not establish precedence.

`T0S` and `T0O` are explicitly unknown mode records. Their proximity to numbered tokens and the shared `T0` spelling do not establish identity.

### Disposition

**State:** `unresolved-pending-adjudication`

Store `T05`, `T07`, `T0-5`, and `T0-7` as distinct atomic token records under `C-002`. Retain the later `T2-5`/`T2-7` descriptions as interpretive evidence. Keep T0 free of numbered or compound cross-references.

### Regression rules

- Do not remove zeroes or hyphens.
- Do not parse transfer direction from token spelling.
- Do not map any disputed token to T0 by adjacency.
- Keep all transfer semantics non-executable.

## C-003 — Unknown numbered records paired with named variants

### Evidence

Corpus p. 5 labels `T01` through `T20` as **Unknown** while pairing them with named objective or subjective variants. The pairing is evidence of a source association, not identity or interchangeability.

### Disposition

**State:** `resolved-by-rule`

Represent every retained numbered-to-named pairing as a provenance-qualified `cross-reference`. Do not use `alias`, `sameAs`, `replacement`, or canonical redirect semantics.

### Regression rules

- A numbered token remains a first-class evidence record.
- `Unknown` remains part of the source statement.
- Cross-reference direction records what the source printed; it does not imply process direction.
- Existing collisions such as `T02` and `T20` remain visible.

## C-004 — Later interpretive title divergence

### Evidence

The early inventory/crosswalk assigns `T20` to `9O – Universal Discretion`. Later interpretive prose assigns `T20` the title **Proprioceptive Sensory Field**. Similar later title differences occur across `T01` through `T20`.

The packet available to the automated reviewers did not include direct text for every cited primary page. Those records therefore retain a `primary-page-unavailable` provenance marker until the raw pages are added to the evidence fixture.

### Disposition

**State:** `unresolved-pending-adjudication`

Use **Universal Discretion** as the provisional T9 family display name defined by the specification. This is a presentation default, not a source-title adjudication. Exact-token lookup for `T20` must return both conflicting evidence records; neither becomes an alias or supersedes the other.

### Regression rules

- Later prose uses source layer `interpretive`.
- Search by a later title returns the evidence record and its `C-004` state, not a canonical redirect.
- Missing direct pages cannot be reconstructed from nearby prose or diagrams.
- No title defines behavior.

## C-005 — System 4 contextual lineage reuse

### Evidence

System 4 uses numbered slots and contextual labels such as `4T4 P`, `T7E`, **Conscious/Emotive/Somatic Perception**, **Memory Resources/Evolutionary Heritage**, and **Cerebral Mentation/Limbic System/Basal System**. The source also describes System 5 as an elaboration of System 4. Lineage does not establish same-model identity.

### Disposition

**State:** `resolved-by-rule`

Store System 4 material in a separate `sys4-context:` namespace. It may be connected to System 5 only with a typed `contextual-lineage` relation. It must not enter System 5 aliases, variants, provisional names, or ordinary exact-token indexes.

### Regression rules

- Preserve exact System 4 tokens and context.
- If an individual p. 3 cell assignment is unavailable, use `assignmentStatus: 'unresolved'`.
- Do not derive a System 5 ID from matching numerals.
- The rejected T9-2 diagram remains queryable rejected evidence, not topology.

## C-006 — Asymmetric atomic compound mappings

### Evidence

The corpus explicitly records asymmetric relations:

| Compound token | Explicit source cross-reference |
| --- | --- |
| `T0-1` | `T1S` |
| `T1-1` | `T1O` |
| `T1-2` | `T2S` |
| `T1-3` | `T3S` |
| `T1-4` through `T1-9` | `T4S` through `T9S` |

`T0-1 → T1S` disproves a general prefix or arithmetic grammar.

### Disposition

**State:** `resolved-by-rule`

Treat every compound as an opaque exact token. Add a typed `explicit-source-cross-reference` only where the source states the target. The relation does not make the compound an alias for the target family or variant.

### Regression rules

- `T1-3` does not resolve as `T1` or `T3`.
- `T0-1` does not enter the T0 family.
- No relation is inferred for `T2-5`, `T2-7`, `T0-5`, `T0-7`, or rejected `T9-2` from spelling alone.
- Compound source notes remain separate evidence layers.

## C-007 — Passive and active under-specification

### Evidence

The source synopsis says passive representation shows structural relations and does not define active properties, process, or meaning. It says active representation depicts process and may contain modes, but it does not supply term-by-term T0–T9 behavior. The provisional corpus contains passive/active headings, diagrams, and unfinished detail slots.

The curated [T1-3 source note](../extracted/t1-3-virtual-image-triad-system-5-bob-re-back-in-thailand/t1-3-virtual-image-triad-system-5-bob-re-back-in-thailand.md) does support two limited visual structures:

- Page 1: five hierarchical interfaces with `L₀` through `L₄` and `D`
- Page 2: a coalesced `(1,2)` pair, closed `(3,4,5)` triad, paired R labels, and virtual-image regions `I₃,₄`, `I₄,₅`, and `I₃,₅`

Page 3 is explicitly marked **Incorrect Diagram**.

### Disposition

**State:** `resolved-by-rule` for representation; `semantic-status-unresolved` for behavior

Registry perspectives remain `heading-only` or `unresolved`. This project may create labelled **Passive (Top view)** and **Active (Side view)** diagrams because the user requested those visual orientations, but the diagram contract must mark `R_n`, `P_k`, and `V_i,j` as **proposed view grammar**. The source's exact virtual-image tokens remain `I_i,j`; `V_i,j` is a requested proposed notation, not a source transcription.

### Regression rules

- A diagram legend separates source tokens, proposed view grammar, and runtime identifiers.
- The diagrams contain all twenty O/S variant records without claiming twenty executable states.
- No passive-to-active conversion is defined.
- Source R/P labels do not resolve to runtime Rn/Pk IDs.
- The Page 3 rejected diagram contributes no accepted relation or geometry.

## Cross-conflict registry rules

1. The registry contains exactly ten families and twenty nested objective/subjective variants.
2. Exact token, registry family, mode, perspective, source layer, conflict, and runtime mapping remain separate fields.
3. Exact-token lookup returns all matching evidence records.
4. Cross-references record source association without declaring identity.
5. Contextual lineage uses a separate namespace.
6. Adjudications append decisions and retain historical evidence.
7. Missing source pages are marked unavailable rather than reconstructed.
8. `runtimeMappings` remains empty until a separately approved behavioral specification exists.

## Diagram constraints derived from the analysis

The [twenty-term diagram model](diagrams/system5-term-view-model.json) declares the visual grammar explicitly:

- `R_n`: proposed cyclic relation around the ordered family set
- `P_k`: proposed linear projection through the ordered family set
- `V_3,4`, `V_4,5`, `V_3,5`: proposed notation for source-attested virtual-image pairs `I_3,4`, `I_4,5`, `I_3,5`

These labels satisfy the requested model while preserving the provenance distinction. They are not current `RelationalWhole`, `Projection`, or pentachoron identifiers.

## Required test gates

The implementation plan must include tests for:

- Ten-family and twenty-variant counts
- Exact numeric order
- Complete `T02` collision lookup
- `T05`/`T07` separation from T0
- Cross-reference-not-alias semantics
- `T20` layered title conflict
- `sys4-context:` namespace isolation
- Compound atomicity and asymmetry
- Heading-only passive/active metadata
- Empty runtime mappings
- Deep immutability
- HTTP `405` rejection for mutation methods
- Diagram model counts, relation status, and rendered artifact presence

## Unresolved adjudications

| Decision | Safe default |
| --- | --- |
| Which `T02` association, if any, controls | Return all evidence |
| How Goal/Discretion maps across `T05`, `T07`, `T0-5`, `T0-7` | Choose none |
| Whether later `T01`–`T20` titles refine or replace earlier titles | Store as secondary evidence |
| Who may adjudicate terminology | Unassigned; do not invent an owner |
| What objective/subjective and passive/active mean operationally | Undefined metadata |
| Whether any term maps to Rn, Pk, virtual-image behavior, or pentachoron cells | No mapping |

## Runtime boundary

This analysis standardizes only evidence storage, querying, conflict status, and safe visualization. It does not define inputs, outputs, state transitions, permissions, biological claims, cognitive behavior, Rn circuits, Pk accounting, virtual-image execution, or pentachoron scheduling. Any such behavior requires a new approved specification and tests that fail before implementation.

## References

- [Provisional T0–T9 term specification](<13 - Provisional T0-T9 Term Specification.md>)
- [Guided System 5 corpus](../extracted/sys-5-dan-explorations-v7/sys-5-dan-explorations-v7.md)
- [System 5 term descriptions](../system5-term-descriptions.md)
- [T1-1 source note](../extracted/t1-1-perception-of-need/t1-1-perception-of-need.md)
- [T1-2 source note](../extracted/t1-2-assessment-of-need/t1-2-assessment-of-need.md)
- [T1-3 source note](../extracted/t1-3-virtual-image-triad-system-5-bob-re-back-in-thailand/t1-3-virtual-image-triad-system-5-bob-re-back-in-thailand.md)
- [T-9 source note](../extracted/t-9-primary-universal-term/t-9-primary-universal-term.md)
- [Current runtime constants](../src/core/constants.js)
