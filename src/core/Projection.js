/**
 * Projection (Pk) — open, unidirectional pipeline with ledger accounting.
 *
 * Implements section 8.2 of the Rn/Pk analysis: projections do not form
 * closed circuits; they project through an ordered list of stages while
 * logging every transformation to a ledger. P1 (revenue) and P2
 * (expenditure) projections run in parallel and are compared on a
 * balance sheet — double-entry bookkeeping for system resources.
 */
export class Projection {
  /**
   * @param {object} options
   * @param {string} options.id Unique identifier (e.g. "P1_C").
   * @param {string} options.name Human readable name.
   * @param {string[]} options.stages Ordered stage/service ids (source → sink).
   * @param {'revenue'|'expenditure'} [options.kind] Ledger column this projection feeds.
   * @param {string} [options.triad] Owning triad id.
   * @param {string} [options.description]
   */
  constructor({ id, name, stages, kind = 'revenue', triad = 'cross', description = '' }) {
    if (!id || !Array.isArray(stages) || stages.length < 2) {
      throw new Error('Projection requires an id and at least two stages (source and sink)');
    }
    if (new Set(stages).size !== stages.length) {
      throw new Error('Projection stages must form an open path (no closed circuits)');
    }
    if (kind !== 'revenue' && kind !== 'expenditure') {
      throw new Error("Projection kind must be 'revenue' or 'expenditure'");
    }
    this.id = id;
    this.name = name || id;
    this.stages = [...stages];
    this.kind = kind;
    this.triad = triad;
    this.description = description;
    this.ledger = [];
  }

  /**
   * Unidirectional flow: push a value through every stage, logging each
   * transformation to the ledger. Returns the ledger entries created.
   */
  flow(value = 1, data = null) {
    if (!(value > 0)) {
      throw new Error('Projection flow value must be a positive number');
    }
    const timestamp = Date.now();
    const entries = this.stages.map((stage, index) => ({
      stage,
      index,
      value,
      data,
      timestamp,
    }));
    this.ledger.push(...entries);
    return entries;
  }

  /** Total accumulated value at the sink (one flow unit counted once). */
  getTotal() {
    if (this.stages.length === 0) return 0;
    const sink = this.stages[this.stages.length - 1];
    return this.ledger
      .filter((entry) => entry.stage === sink)
      .reduce((sum, entry) => sum + entry.value, 0);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      stages: [...this.stages],
      kind: this.kind,
      triad: this.triad,
      description: this.description,
      total: this.getTotal(),
      ledgerSize: this.ledger.length,
    };
  }

  static fromJSON(json) {
    return new Projection(json);
  }
}

/**
 * AccountingSystem — compares parallel P1 (revenue) and P2 (expenditure)
 * projections, producing a balance sheet and triggering contingency
 * mechanisms on deficit ("sales can't perform at a loss").
 */
export class AccountingSystem {
  /**
   * @param {Projection[]} [projections] Initial projections to track.
   * @param {(deficit: number, sheet: object) => void} [onContingency]
   *        Callback invoked when a deficit is detected.
   */
  constructor(projections = [], onContingency = null) {
    this.projections = new Map();
    this.onContingency = onContingency;
    this.contingencies = [];
    for (const projection of projections) {
      this.add(projection);
    }
  }

  add(projection) {
    if (this.projections.has(projection.id)) {
      throw new Error(`Projection '${projection.id}' already registered`);
    }
    this.projections.set(projection.id, projection);
    return projection;
  }

  remove(id) {
    return this.projections.delete(id);
  }

  get(id) {
    return this.projections.get(id) ?? null;
  }

  list() {
    return [...this.projections.values()];
  }

  /** Revenue and expenditure columns of the balance sheet. */
  totals() {
    let revenue = 0;
    let expenditure = 0;
    for (const projection of this.projections.values()) {
      if (projection.kind === 'revenue') revenue += projection.getTotal();
      else expenditure += projection.getTotal();
    }
    return { revenue, expenditure };
  }

  /**
   * Compare revenue vs expenditure. A negative balance is a deficit and
   * triggers the contingency mechanism (resource reallocation, activity
   * inhibition, optimization logging).
   */
  compareBalance() {
    const { revenue, expenditure } = this.totals();
    const balance = revenue - expenditure;
    const sheet = { revenue, expenditure, balance, deficit: balance < 0 };
    if (balance < 0) {
      this.triggerContingency(Math.abs(balance), sheet);
    }
    return sheet;
  }

  triggerContingency(deficit, sheet) {
    const record = { deficit, sheet, timestamp: Date.now() };
    this.contingencies.push(record);
    if (typeof this.onContingency === 'function') {
      this.onContingency(deficit, sheet);
    }
    return record;
  }
}
