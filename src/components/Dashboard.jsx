import React from 'react';
import classNames from 'classnames';
import { useSystemStore } from '../store/systemStore.js';

/**
 * Dashboard — real-time overview of the triadic architecture: triad
 * cards, countercurrent Rn balance, the Pk balance sheet and the
 * dimensional flow mappings.
 */
export default function Dashboard() {
  const triads = useSystemStore((state) => state.triads);
  const dimensions = useSystemStore((state) => state.dimensions);
  const snapshot = useSystemStore((state) => state.snapshot);
  const cycles = useSystemStore((state) => state.cycles);
  const log = useSystemStore((state) => state.log);

  const { rnFlows, pkFlows, balanceSheet, totalImbalance } = snapshot;

  return (
    <div className="dashboard">
      <section className="metrics-row">
        <div className="metric-card">
          <span className="metric-label">Cycles processed</span>
          <span className="metric-value">{cycles}</span>
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

      <section className="triads-row">
        {Object.values(triads).map((triad) => (
          <article key={triad.id} className="triad-card" style={{ borderTopColor: triad.color }}>
            <header>
              <h2>{triad.name} Triad</h2>
              <span className="polarity-badge" style={{ background: triad.color }}>
                {triad.polarity}
              </span>
            </header>
            <p className="triad-description">{triad.description}</p>
            <ul className="service-list">
              {triad.services.map((service) => (
                <li key={service.code}>
                  <strong>{service.code}</strong> {service.name}
                  <span className="service-role">{service.role}</span>
                </li>
              ))}
            </ul>
            <footer className="triad-footer">
              <span>
                Rn: {rnFlows.filter((rn) => rn.triad === triad.id).length} · Pk:{' '}
                {pkFlows.filter((pk) => pk.triad === triad.id).length}
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
