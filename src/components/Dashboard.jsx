import React from 'react';
import classNames from 'classnames';
import { useSystemStore } from '../store/systemStore.js';

/**
 * Dashboard — real-time overview of the pentachoral architecture:
 * vertex cards for all five 5-cell vertices, the staggered-cycle phase
 * indicator with per-cell balance, countercurrent Rn balance, the Pk
 * balance sheet and the dimensional flow mappings.
 */
export default function Dashboard() {
  const vertices = useSystemStore((state) => state.vertices);
  const dimensions = useSystemStore((state) => state.dimensions);
  const snapshot = useSystemStore((state) => state.snapshot);
  const cycles = useSystemStore((state) => state.cycles);
  const steps = useSystemStore((state) => state.steps);
  const log = useSystemStore((state) => state.log);

  const { rnFlows, pkFlows, balanceSheet, totalImbalance, pentachoron, cycle } = snapshot;

  return (
    <div className="dashboard">
      <section className="metrics-row">
        <div className="metric-card">
          <span className="metric-label">Cycles processed</span>
          <span className="metric-value">{cycles}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Pentachoral steps (t)</span>
          <span className="metric-value">{steps}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Rn imbalance |E_R1 − E_R2|</span>
          <span className={classNames('metric-value', totalImbalance > 0 ? 'text-warn' : 'text-ok')}>
            {totalImbalance.toFixed(2)}
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Pk revenue (P1)</span>
          <span className="metric-value">{balanceSheet.revenue.toFixed(2)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Pk expenditure (P2)</span>
          <span className="metric-value">{balanceSheet.expenditure.toFixed(2)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Balance sheet</span>
          <span className={classNames('metric-value', balanceSheet.deficit ? 'text-warn' : 'text-ok')}>
            {balanceSheet.balance >= 0 ? '+' : ''}
            {balanceSheet.balance.toFixed(2)}
          </span>
        </div>
      </section>

      <section className="panel">
        <h2>Pentachoral Cells — Staggered 5-Step Cycle</h2>
        <div className="phase-indicator">
          {cycle.phases.map((phase) => (
            <div
              key={phase.phase}
              className={classNames('phase-step', {
                active: cycle.phase === phase.phase,
                rest: phase.mode === 'rest',
              })}
              title={phase.description}
            >
              <span className="phase-step-index">t≡{phase.phase}</span>
              <span className="phase-step-name">
                {pentachoron.cells.find((cell) => cell.id === phase.cell)?.short ?? phase.cell}
              </span>
            </div>
          ))}
        </div>
        <div className="cells-row">
          {pentachoron.cells.map((cell) => (
            <article
              key={cell.id}
              className={classNames('cell-card', { 'cell-card-active': cycle.phase === cell.phase })}
            >
              <header>
                <h3>
                  {cell.short} · {cell.name}
                </h3>
                <span className={classNames('status-pill', cell.balanced ? 'status-ok' : 'status-warn')}>
                  {cell.balanced ? 'Balanced' : 'Imbalanced'}
                </span>
              </header>
              <p className="cell-description">{cell.description}</p>
              <div className="cell-vertices">
                {cell.vertices.map((vertexId) => (
                  <span
                    key={vertexId}
                    className="vertex-chip"
                    style={{ background: vertices[vertexId]?.color }}
                    title={vertices[vertexId]?.label ?? vertices[vertexId]?.name}
                  />
                ))}
                <span className="cell-omits">omits {vertices[cell.omits]?.name ?? cell.omits}</span>
              </div>
              <footer className="cell-footer">
                <span>Imbalance: {cell.imbalance.toFixed(2)}</span>
                <span>
                  Phase {cell.phase} · {cell.mode}
                </span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="triads-row">
        {Object.values(vertices).map((vertex) => (
          <article key={vertex.id} className="triad-card" style={{ borderTopColor: vertex.color }}>
            <header>
              <h2>{vertex.label ?? `${vertex.name} Triad`}</h2>
              <span className="polarity-badge" style={{ background: vertex.color }}>
                {vertex.polarity}
              </span>
            </header>
            <p className="triad-description">{vertex.description}</p>
            <ul className="service-list">
              {vertex.services.map((service) => (
                <li key={service.code}>
                  <strong>{service.code}</strong> {service.name}
                  <span className="service-role">{service.role}</span>
                </li>
              ))}
            </ul>
            <footer className="triad-footer">
              <span>
                Rn: {rnFlows.filter((rn) => rn.triad === vertex.id).length} · Pk:{' '}
                {pkFlows.filter((pk) => pk.triad === vertex.id).length}
              </span>
            </footer>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2>Dimensional Flows</h2>
        <div className="dimension-grid">
          {dimensions.map((dimension) => (
            <div key={dimension.id} className="dimension-card">
              <h3>{dimension.name}</h3>
              <p className="dimension-flow">
                {dimension.from} → {dimension.to}
              </p>
              <p className="dimension-nature">{dimension.nature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Activity Log</h2>
        {log.length === 0 ? (
          <p className="empty-hint">No activity yet — run a [3-6-9] cycle or trigger flows from the editors.</p>
        ) : (
          <ul className="activity-log">
            {log.map((entry, index) => (
              <li key={`${entry.timestamp}-${index}`}>
                <time>{new Date(entry.timestamp).toLocaleTimeString()}</time>
                <span>{entry.message}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
