import { RelationalWhole } from './RelationalWhole.js';
import { Projection, AccountingSystem } from './Projection.js';
import { Pentachoron } from './Pentachoron.js';
import {
  TRIADS,
  VERTICES,
  DEFAULT_RN_FLOWS,
  CROSS_TRIAD_RN_FLOWS,
  DEFAULT_PK_FLOWS,
  PENTACHORON,
  PENTACHORAL_CYCLE,
} from './constants.js';

/**
 * TriadicSystem — the complete Cosmos System 5 model (section 8.3),
 * pentachorally enhanced.
 *
 * Composes the three triads (Cerebral, Somatic, Autonomic) with their
 * intra-triad Relational Wholes, the full K5 cross-vertex Rn edge set
 * of the pentachoron (5-cell) spanning the shared P-5 Integration core
 * and the Environmental boundary vertex, and the P1/P2 projection
 * pipelines that feed the system-wide accounting balance sheet. The
 * staggered 5-step cycle activates one tetrahedral cell per step
 * (t ≡ 0..3 mod 5) with a rest/global-rebalance step at t ≡ 4 (mod 5).
 */
export class TriadicSystem {
  constructor({ withDefaults = true } = {}) {
    this.triads = TRIADS;
    this.vertices = VERTICES;
    this.pentachoron = new Pentachoron(PENTACHORON);
    this.cycleStep = 0;
    this.lastActivation = null;
    this.rnFlows = new Map();
    this.accounting = new AccountingSystem();
    if (withDefaults) {
      for (const spec of [...DEFAULT_RN_FLOWS, ...CROSS_TRIAD_RN_FLOWS]) {
        this.addRnFlow(spec);
      }
      for (const spec of DEFAULT_PK_FLOWS) {
        this.addPkFlow(spec);
      }
    }
  }

  /** Register a Relational Whole from a spec or instance. */
  addRnFlow(spec) {
    const rn = spec instanceof RelationalWhole ? spec : new RelationalWhole(spec);
    if (this.rnFlows.has(rn.id)) {
      throw new Error(`Relational whole '${rn.id}' already registered`);
    }
    this.rnFlows.set(rn.id, rn);
    return rn;
  }

  removeRnFlow(id) {
    return this.rnFlows.delete(id);
  }

  getRnFlow(id) {
    return this.rnFlows.get(id) ?? null;
  }

  listRnFlows() {
    return [...this.rnFlows.values()];
  }

  /** Register a Projection from a spec or instance. */
  addPkFlow(spec) {
    const pk = spec instanceof Projection ? spec : new Projection(spec);
    return this.accounting.add(pk);
  }

  removePkFlow(id) {
    return this.accounting.remove(id);
  }

  getPkFlow(id) {
    return this.accounting.get(id);
  }

  listPkFlows() {
    return this.accounting.list();
  }

  /**
   * Process one full cycle through the [3-6-9] topology: every Rn flow
   * runs its forward (R1) and backward (R2) circuit and is rebalanced,
   * and every Pk pipeline transports one unit into its ledger. Returns a
   * snapshot of the resulting system state.
   */
  processCycle(energy = 1) {
    for (const rn of this.rnFlows.values()) {
      rn.forwardFlow(energy);
      rn.backwardFlow(energy);
      rn.checkBalance();
    }
    for (const pk of this.accounting.list()) {
      pk.flow(energy);
    }
    return this.snapshot();
  }

  /**
   * Advance the staggered 5-step pentachoral cycle by one step.
   *
   * The cell assigned to phase t mod 5 is activated: each of its 6 Rn
   * edges runs its R1/R2 circuit and is rebalanced, and the Pk
   * pipelines of its member vertices transport one unit. Phase 4
   * (t ≡ 4 mod 5) is the rest step: no flows run; every Rn circuit is
   * globally rebalanced instead. Returns an activation record.
   */
  stepCycle(energy = 1) {
    const step = this.cycleStep;
    const phase = step % PENTACHORAL_CYCLE.length;
    const spec = PENTACHORAL_CYCLE[phase];
    const cell = this.pentachoron.getCell(spec.cell);
    const activation = {
      step,
      phase,
      mode: spec.mode,
      cell: cell.id,
      cellShort: cell.short,
      cellName: cell.name,
      edges: [],
      projections: [],
      rebalanced: 0,
    };
    if (spec.mode === 'rest') {
      for (const rn of this.rnFlows.values()) {
        rn.checkBalance();
        activation.rebalanced += 1;
      }
    } else {
      for (const edge of this.pentachoron.edgesWithin(cell.vertices)) {
        const rn = this.rnFlows.get(edge.rn);
        if (!rn) continue;
        rn.forwardFlow(energy);
        rn.backwardFlow(energy);
        rn.checkBalance();
        activation.edges.push(rn.id);
      }
      for (const pk of this.accounting.list()) {
        if (cell.vertices.includes(pk.triad)) {
          pk.flow(energy);
          activation.projections.push(pk.id);
        }
      }
    }
    this.cycleStep = step + 1;
    this.lastActivation = activation;
    return activation;
  }

  /** System-wide balance: countercurrent Rn balance + Pk balance sheet. */
  snapshot() {
    const rnFlows = this.listRnFlows().map((rn) => rn.toJSON());
    const pkFlows = this.listPkFlows().map((pk) => pk.toJSON());
    const balanceSheet = this.accounting.compareBalance();
    const totalImbalance = rnFlows.reduce((sum, rn) => sum + rn.imbalance, 0);
    const cycleSpecByCell = new Map(PENTACHORAL_CYCLE.map((spec) => [spec.cell, spec]));
    const cells = this.pentachoron.cellMetrics(this.rnFlows).map((cell) => ({
      ...cell,
      phase: cycleSpecByCell.get(cell.id)?.phase ?? null,
      mode: cycleSpecByCell.get(cell.id)?.mode ?? 'active',
    }));
    const faces = this.pentachoron.faceMetrics(this.rnFlows);
    return {
      triads: this.triads,
      rnFlows,
      pkFlows,
      balanceSheet,
      totalImbalance,
      balanced: rnFlows.every((rn) => rn.balanced) && !balanceSheet.deficit,
      pentachoron: {
        vertices: [...this.pentachoron.vertices],
        edges: this.pentachoron.edges.map((edge) => ({ ...edge, vertices: [...edge.vertices] })),
        faces,
        cells,
        balanced: cells.every((cell) => cell.balanced),
      },
      cycle: {
        step: this.cycleStep,
        phase: this.cycleStep % PENTACHORAL_CYCLE.length,
        phases: PENTACHORAL_CYCLE,
        lastActivation: this.lastActivation,
      },
    };
  }
}
