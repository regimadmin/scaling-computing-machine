# Cosmos System Interface

Interactive visualization and management interface for **Cosmos System Relational Wholes (Rn)** and **Projections (Pk)**, implementing part 1 of the plan from the
[comprehensive Rn/Pk analysis](<sources/COSMOS_SYSTEM_RN_PK_COMPLETE_ANALYSIS (1).md>).

## Concepts

- **Relational Wholes (Rn)** — closed circuits with countercurrent balance: a forward flow (R1) from a subjective service through a **pivot** to an objective service, balanced by a backward feedback flow (R2). The pivot effects countercurrent balance (`|E_R1| ≈ |E_R2|`).
- **Projections (Pk)** — open, unidirectional pipelines tracked as parallel accounting ledgers. P1 (revenue/input) and P2 (expenditure/output) pipelines feed a double-entry balance sheet; deficits trigger contingency mechanisms.
- **Triadic architecture** — three concurrent processing streams mirroring the nervous system: **Cerebral** (Potential), **Somatic** (Commitment), **Autonomic** (Performance), integrated through the shared **P-5** processing core and cross-triad Rn flows (`R_CS`, `R_SA`, `R_AC`).
- **Pentachoral structure (5-cell)** — the tetrahedral System 5 ([analysis §7](<sources/COSMOS_SYSTEM_RN_PK_COMPLETE_ANALYSIS (1).md>)) extended to a 4-simplex: **5 vertices** (the three triads plus the explicit **Integration core** and **Environmental boundary**), **10 Rn edges** (the complete K5 graph), **10 triadic faces** and **5 tetrahedral cells** — each cell omits one vertex, forming a 4-of-5 complementarity thread. The original [3-6-9] loop survives as the C-S-A face.
- **Staggered 5-step cycle** — per the [System 5 hierarchical timing model](SYSTEM5_HIERARCHICAL_DOCUMENTATION.md), each step `t` activates the cell assigned to `t mod 5` (phases 0–3 run a tensor-bundle cell's 6 Rn edges and its Pk pipelines; phase 4 is the rest/global-rebalance step).

## Features

- 📊 **Dashboard** — real-time metrics: Rn countercurrent imbalance, Pk balance sheet, cards for all five pentachoral vertices, per-cell balance with cycle-phase indicator, dimensional flows ([D-T], [P-O], [S-M], [E-I]) and an activity log
- 🔄 **Rn Editor** — create/manage relational wholes, trigger R1/R2 flows, monitor and restore countercurrent balance, see each edge's tetrahedral-cell membership
- 📈 **Pk Editor** — create/manage projections with double-entry bookkeeping, ledger totals and deficit/contingency tracking
- 🎨 **Visualizer** — interactive D3 Petrie-polygon (pentagon) projection of the 5-cell: all 10 Rn edges (perimeter + pentagram diagonals), dashed Pk paths, hover/pin a cell to highlight its 4 vertices and 6 edges
- ▶ **[3-6-9] cycle processing** — one click runs every Rn circuit and Pk pipeline through the Potential → Commitment → Performance loop
- ⬠ **Staggered pentachoral cycle** — step the 5-phase cycle one cell at a time (`t mod 5`, with a rest step)

## Getting Started

```bash
npm install
npm run dev      # start the Vite dev server (http://localhost:5173)
npm run server   # optional: start the Express API + WebSocket server (http://localhost:3001)
npm test         # run the core model unit tests
npm run build    # production build
```

## Project Structure

```
├── index.html            # App entry page
├── main.jsx              # React bootstrap
├── server.js             # Express REST API + WebSocket snapshot broadcast
├── src/
│   ├── core/             # Framework-agnostic domain model
│   │   ├── constants.js      # Triads, vertices, dimensions, pentachoron topology, default Rn/Pk flows
│   │   ├── RelationalWhole.js# Rn: closed circuits with countercurrent balance
│   │   ├── Projection.js     # Pk: open pipelines + AccountingSystem balance sheet
│   │   ├── Pentachoron.js    # 5-cell topology: simplex invariants, cell lookups, per-cell metrics
│   │   └── TriadicSystem.js  # Composed System 5 model with [3-6-9] and staggered 5-step cycles
│   ├── store/            # Zustand store wrapping the core model
│   ├── components/       # Dashboard, RnEditor, PkEditor, Visualizer views
│   ├── App.jsx           # 4-view navigation shell
│   └── styles.css        # CSS-variable design system
└── test/                 # Node test-runner unit tests for the core model
```

## API Routes (`npm run server`)

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/system` | Full system snapshot (includes pentachoral state + cycle phase) |
| GET | `/api/triads` | Triad, vertex and dimension definitions |
| GET | `/api/pentachoron` | Pentachoron topology: vertices, edges, faces, cells with per-cell balance and cycle phase |
| GET/POST | `/api/rn` | List / create relational wholes |
| DELETE | `/api/rn/:id` | Remove a relational whole |
| POST | `/api/rn/:id/forward` · `/backward` · `/balance` | Run R1/R2 flows, restore balance |
| GET/POST | `/api/pk` | List / create projections |
| DELETE | `/api/pk/:id` | Remove a projection |
| POST | `/api/pk/:id/flow` | Project units through a pipeline |
| GET | `/api/balance-sheet` | Revenue vs expenditure comparison |
| POST | `/api/cycle` | Process a full [3-6-9] cycle |
| POST | `/api/step` | Advance the staggered 5-step pentachoral cycle by one step |

A WebSocket endpoint at `/ws` broadcasts system snapshots after every mutation.
