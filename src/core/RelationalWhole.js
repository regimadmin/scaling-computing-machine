/**
 * Relational Whole (Rn) — closed circuit with countercurrent balance.
 *
 * Implements section 8.1 of the Rn/Pk analysis: a bidirectional channel
 * between two services mediated by a pivot service. Energy sent forward
 * (R1) must be balanced by energy returned backward (R2); the pivot
 * effects the countercurrent balance (|E_R1| ≈ |E_R2|).
 */
export class RelationalWhole {
  /**
   * @param {object} options
   * @param {string} options.id Unique identifier (e.g. "R_CS").
   * @param {string} options.name Human readable name.
   * @param {string} options.serviceA Source/subjective service id.
   * @param {string} options.serviceB Target/objective service id.
   * @param {string} options.pivot Pivot service id that balances flows.
   * @param {string} [options.triad] Owning triad id or "cross".
   * @param {string} [options.description]
   * @param {number} [options.threshold] Max tolerated |E_R1 - E_R2| imbalance.
   */
  constructor({ id, name, serviceA, serviceB, pivot, triad = 'cross', description = '', threshold = 10 }) {
    if (!id || !serviceA || !serviceB || !pivot) {
      throw new Error('RelationalWhole requires id, serviceA, serviceB and pivot');
    }
    if (serviceA === serviceB) {
      throw new Error('RelationalWhole requires two distinct services to coalesce');
    }
    this.id = id;
    this.name = name || id;
    this.serviceA = serviceA;
    this.serviceB = serviceB;
    this.pivot = pivot;
    this.triad = triad;
    this.description = description;
    this.threshold = threshold;
    this.r1Energy = 0;
    this.r2Energy = 0;
    this.history = [];
  }

  /** R1: forward (subjective) flow from serviceA through pivot to serviceB. */
  forwardFlow(energy = 1, data = null) {
    if (!(energy > 0)) {
      throw new Error('Flow energy must be a positive number');
    }
    this.r1Energy += energy;
    const event = {
      flow: 'R1_forward',
      path: [this.serviceA, this.pivot, this.serviceB],
      energy,
      data,
      timestamp: Date.now(),
    };
    this.history.push(event);
    return event;
  }

  /** R2: backward (objective feedback) flow from serviceB through pivot to serviceA. */
  backwardFlow(energy = 1, data = null) {
    if (!(energy > 0)) {
      throw new Error('Flow energy must be a positive number');
    }
    this.r2Energy += energy;
    const event = {
      flow: 'R2_backward',
      path: [this.serviceB, this.pivot, this.serviceA],
      energy,
      data,
      timestamp: Date.now(),
    };
    this.history.push(event);
    return event;
  }

  /** Countercurrent imbalance |E_R1 - E_R2|. Zero means perfect balance. */
  get imbalance() {
    return Math.abs(this.r1Energy - this.r2Energy);
  }

  /** True while the countercurrent flows remain within the tolerated threshold. */
  get balanced() {
    return this.imbalance <= this.threshold;
  }

  /**
   * Monitor countercurrent balance. When the imbalance exceeds the
   * threshold the flows are adjusted (both sides settle on their mean),
   * restoring energy conservation across the circuit.
   */
  checkBalance() {
    const imbalance = this.imbalance;
    if (imbalance > this.threshold) {
      this.adjustFlows();
    }
    return imbalance;
  }

  /** Restore countercurrent balance by settling both flows on their mean. */
  adjustFlows() {
    const mean = (this.r1Energy + this.r2Energy) / 2;
    this.r1Energy = mean;
    this.r2Energy = mean;
    this.history.push({
      flow: 'balance_adjustment',
      path: [this.pivot],
      energy: mean,
      data: null,
      timestamp: Date.now(),
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      serviceA: this.serviceA,
      serviceB: this.serviceB,
      pivot: this.pivot,
      triad: this.triad,
      description: this.description,
      threshold: this.threshold,
      r1Energy: this.r1Energy,
      r2Energy: this.r2Energy,
      imbalance: this.imbalance,
      balanced: this.balanced,
    };
  }

  static fromJSON(json) {
    const rn = new RelationalWhole(json);
    rn.r1Energy = json.r1Energy ?? 0;
    rn.r2Energy = json.r2Energy ?? 0;
    return rn;
  }
}
