import React, { useState } from 'react';
import classNames from 'classnames';
import { useSystemStore } from '../store/systemStore.js';

/**
 * Pk Editor — create and manage Projections: open, unidirectional
 * pipelines tracked as parallel accounting ledgers. P1 (revenue) and
 * P2 (expenditure) columns are compared on the balance sheet.
 */
export default function PkEditor() {
  const vertices = useSystemStore((state) => state.vertices);
  const pkFlows = useSystemStore((state) => state.snapshot.pkFlows);
  const balanceSheet = useSystemStore((state) => state.snapshot.balanceSheet);
  const addPkFlow = useSystemStore((state) => state.addPkFlow);
  const removePkFlow = useSystemStore((state) => state.removePkFlow);
  const runPkFlow = useSystemStore((state) => state.runPkFlow);

  const [form, setForm] = useState({
    id: '',
    name: '',
    kind: 'revenue',
    triad: 'cross',
    stages: 'external.environment, somatic.S-8, somatic.O-4',
  });
  const [error, setError] = useState(null);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleCreate = (event) => {
    event.preventDefault();
    setError(null);
    try {
      addPkFlow({
        id: form.id.trim(),
        name: form.name.trim() || form.id.trim(),
        kind: form.kind,
        triad: form.triad,
        stages: form.stages.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setForm({ ...form, id: '', name: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const revenues = pkFlows.filter((pk) => pk.kind === 'revenue');
  const expenditures = pkFlows.filter((pk) => pk.kind === 'expenditure');

  return (
    <div className="editor">
      <section className="panel balance-sheet-panel">
        <h2>Balance Sheet (Double-Entry Bookkeeping)</h2>
        <div className="balance-sheet">
          <div className="balance-column">
            <h3>Revenue (P1 — inputs)</h3>
            <span className="balance-total">{balanceSheet.revenue.toFixed(2)}</span>
          </div>
          <div className="balance-column">
            <h3>Expenditure (P2 — outputs)</h3>
            <span className="balance-total">{balanceSheet.expenditure.toFixed(2)}</span>
          </div>
          <div className={classNames('balance-column', balanceSheet.deficit ? 'deficit' : 'surplus')}>
            <h3>Balance</h3>
            <span className="balance-total">
              {balanceSheet.balance >= 0 ? '+' : ''}
              {balanceSheet.balance.toFixed(2)}
            </span>
            {balanceSheet.deficit && <span className="status-pill status-warn">Deficit — contingency triggered</span>}
          </div>
        </div>
      </section>

      <section className="panel">
        <h2>Create Projection</h2>
        <p className="panel-hint">
          A projection is an open path (no closed circuits): energy projects through ordered stages,
          logging every transformation to its ledger for accounting.
        </p>
        <form className="flow-form" onSubmit={handleCreate}>
          <label>
            Identifier
            <input value={form.id} onChange={update('id')} placeholder="e.g. P1_custom" required />
          </label>
          <label>
            Name
            <input value={form.name} onChange={update('name')} placeholder="Optional display name" />
          </label>
          <label>
            Ledger column
            <select value={form.kind} onChange={update('kind')}>
              <option value="revenue">Revenue (P1 — input)</option>
              <option value="expenditure">Expenditure (P2 — output)</option>
            </select>
          </label>
          <label>
            Owning vertex
            <select value={form.triad} onChange={update('triad')}>
              {Object.values(vertices).map((vertex) => (
                <option key={vertex.id} value={vertex.id}>{vertex.label ?? vertex.name}</option>
              ))}
              <option value="cross">Cross-triad</option>
            </select>
          </label>
          <label className="span-2">
            Stages (comma-separated, source → sink)
            <input value={form.stages} onChange={update('stages')} placeholder="external.environment, somatic.S-8, somatic.O-4" />
          </label>
          <button type="submit" className="btn btn-primary">Create Pk</button>
        </form>
        {error && <p className="form-error">⚠ {error}</p>}
      </section>

      <section className="panel">
        <h2>Projection Ledgers ({pkFlows.length})</h2>
        <div className="ledger-columns">
          {[{ title: 'P1 — Revenue pipelines', items: revenues }, { title: 'P2 — Expenditure pipelines', items: expenditures }].map((column) => (
            <div key={column.title} className="ledger-column">
              <h3>{column.title}</h3>
              {column.items.length === 0 && <p className="empty-hint">No pipelines.</p>}
              {column.items.map((pk) => (
                <article key={pk.id} className="pk-card">
                  <header>
                    <strong>{pk.id}</strong>
                    <span className="cell-subtext">{pk.name}</span>
                  </header>
                  <p className="mono pk-stages">{pk.stages.join(' → ')}</p>
                  <footer>
                    <span>
                      Total: <strong>{pk.total.toFixed(2)}</strong> · Ledger entries: {pk.ledgerSize}
                    </span>
                    <span className="actions-cell">
                      <button className="btn btn-sm" onClick={() => runPkFlow(pk.id)} title="Project one unit through the pipeline">
                        Flow +1
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => removePkFlow(pk.id)} title="Remove">
                        ✕
                      </button>
                    </span>
                  </footer>
                </article>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
