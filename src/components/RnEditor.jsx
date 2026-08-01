import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { useSystemStore } from '../store/systemStore.js';
import { vertexServiceId } from '../core/index.js';

function serviceOptions(vertices) {
  const options = [];
  for (const vertex of Object.values(vertices)) {
    for (const service of vertex.services) {
      options.push({
        value: vertexServiceId(vertex, service),
        label: `${vertex.name} ${service.code} (${service.name})`,
      });
    }
  }
  return options;
}

/**
 * Rn Editor — create and manage Relational Wholes: closed circuits with
 * countercurrent R1/R2 balance across a pivot service.
 */
export default function RnEditor() {
  const vertices = useSystemStore((state) => state.vertices);
  const rnFlows = useSystemStore((state) => state.snapshot.rnFlows);
  const cells = useSystemStore((state) => state.snapshot.pentachoron.cells);
  const addRnFlow = useSystemStore((state) => state.addRnFlow);
  const removeRnFlow = useSystemStore((state) => state.removeRnFlow);
  const runRnForward = useSystemStore((state) => state.runRnForward);
  const runRnBackward = useSystemStore((state) => state.runRnBackward);
  const rebalanceRn = useSystemStore((state) => state.rebalanceRn);

  const options = useMemo(() => serviceOptions(vertices), [vertices]);
  const cellsByRn = useMemo(() => {
    const map = new Map();
    for (const cell of cells) {
      for (const rnId of cell.rnIds) {
        if (!map.has(rnId)) map.set(rnId, []);
        map.get(rnId).push(cell.short);
      }
    }
    return map;
  }, [cells]);

  const [form, setForm] = useState({
    id: '',
    name: '',
    serviceA: options[0]?.value ?? '',
    serviceB: options[1]?.value ?? '',
    pivot: 'shared.P-5',
    triad: 'cross',
    threshold: 10,
  });
  const [error, setError] = useState(null);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleCreate = (event) => {
    event.preventDefault();
    setError(null);
    try {
      addRnFlow({
        ...form,
        id: form.id.trim(),
        name: form.name.trim() || form.id.trim(),
        threshold: Number(form.threshold) || 10,
      });
      setForm({ ...form, id: '', name: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="editor">
      <section className="panel">
        <h2>Create Relational Whole</h2>
        <p className="panel-hint">
          A relational whole forms a closed circuit: R1 flows A → pivot → B, R2 feeds back B → pivot → A.
          The pivot effects countercurrent balance (|E_R1| ≈ |E_R2|).
        </p>
        <form className="flow-form" onSubmit={handleCreate}>
          <label>
            Identifier
            <input value={form.id} onChange={update('id')} placeholder="e.g. R_custom" required />
          </label>
          <label>
            Name
            <input value={form.name} onChange={update('name')} placeholder="Optional display name" />
          </label>
          <label>
            Service A (subjective)
            <select value={form.serviceA} onChange={update('serviceA')}>
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label>
            Service B (objective)
            <select value={form.serviceB} onChange={update('serviceB')}>
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label>
            Pivot (balance point)
            <select value={form.pivot} onChange={update('pivot')}>
              {options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
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
          <label>
            Balance threshold
            <input type="number" min="0" step="1" value={form.threshold} onChange={update('threshold')} />
          </label>
          <button type="submit" className="btn btn-primary">Create Rn</button>
        </form>
        {error && <p className="form-error">⚠ {error}</p>}
      </section>

      <section className="panel">
        <h2>Relational Wholes ({rnFlows.length})</h2>
        <div className="flow-table-wrap">
          <table className="flow-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Circuit</th>
                <th>Pivot</th>
                <th>E_R1</th>
                <th>E_R2</th>
                <th>Balance</th>
                <th>Cells</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rnFlows.map((rn) => (
                <tr key={rn.id}>
                  <td>
                    <strong>{rn.id}</strong>
                    <span className="cell-subtext">{rn.name}</span>
                  </td>
                  <td className="mono">{rn.serviceA} ⇄ {rn.serviceB}</td>
                  <td className="mono">{rn.pivot}</td>
                  <td>{rn.r1Energy.toFixed(2)}</td>
                  <td>{rn.r2Energy.toFixed(2)}</td>
                  <td>
                    <span className={classNames('status-pill', rn.balanced ? 'status-ok' : 'status-warn')}>
                      {rn.balanced ? 'balanced' : `Δ ${rn.imbalance.toFixed(2)}`}
                    </span>
                  </td>
                  <td className="mono">{cellsByRn.get(rn.id)?.join(' ') ?? '—'}</td>
                  <td className="actions-cell">
                    <button className="btn btn-sm" onClick={() => runRnForward(rn.id)} title="Run R1 forward flow">
                      R1 →
                    </button>
                    <button className="btn btn-sm" onClick={() => runRnBackward(rn.id)} title="Run R2 backward flow">
                      ← R2
                    </button>
                    <button className="btn btn-sm" onClick={() => rebalanceRn(rn.id)} title="Restore countercurrent balance">
                      ⚖
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => removeRnFlow(rn.id)} title="Remove">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
