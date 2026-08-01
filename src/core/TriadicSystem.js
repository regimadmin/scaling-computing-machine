import { RelationalWhole } from './RelationalWhole.js';
import { Projection, AccountingSystem } from './Projection.js';
import {
  TRIADS,
  DEFAULT_RN_FLOWS,
  CROSS_TRIAD_RN_FLOWS,
  DEFAULT_PK_FLOWS,
} from './constants.js';

/**
 * TriadicSystem — the complete Cosmos System 5 model (section 8.3).
 *
 * Composes the three triads (Cerebral, Somatic, Autonomic) with their
 * intra-triad Relational Wholes, the cross-triad Rn flows pivoted
 * through the shared P-5 core, and the P1/P2 projection pipelines that
 * feed the system-wide accounting balance sheet.
 */
export class TriadicSystem {
  constructor({ withDefaults = true } = {}) {
    this.triads = TRIADS;
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

  /** System-wide balance: countercurrent Rn balance + Pk balance sheet. */
  snapshot() {
    const rnFlows = this.listRnFlows().map((rn) => rn.toJSON());
    const pkFlows = this.listPkFlows().map((pk) => pk.toJSON());
    const balanceSheet = this.accounting.compareBalance();
    const totalImbalance = rnFlows.reduce((sum, rn) => sum + rn.imbalance, 0);
    return {
      triads: this.triads,
      rnFlows,
      pkFlows,
      balanceSheet,
      totalImbalance,
      balanced: rnFlows.every((rn) => rn.balanced) && !balanceSheet.deficit,
    };
  }
}
