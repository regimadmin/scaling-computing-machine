import React, { useState } from 'react';
import classNames from 'classnames';
import Dashboard from './components/Dashboard.jsx';
import RnEditor from './components/RnEditor.jsx';
import PkEditor from './components/PkEditor.jsx';
import Visualizer from './components/Visualizer.jsx';
import { useSystemStore } from './store/systemStore.js';

const VIEWS = [
  { id: 'dashboard', label: '📊 Dashboard', component: Dashboard },
  { id: 'rn-editor', label: '🔄 Rn Editor', component: RnEditor },
  { id: 'pk-editor', label: '📈 Pk Editor', component: PkEditor },
  { id: 'visualizer', label: '🎨 Visualizer', component: Visualizer },
];

export default function App() {
  const [view, setView] = useState('dashboard');
  const processCycle = useSystemStore((state) => state.processCycle);
  const balanced = useSystemStore((state) => state.snapshot.balanced);

  const ActiveView = VIEWS.find((v) => v.id === view)?.component ?? Dashboard;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <h1>Cosmos System Interface</h1>
          <p>Relational Wholes (Rn) &amp; Projections (Pk) between active interfaces</p>
        </div>
        <div className="app-header-actions">
          <span className={classNames('status-pill', balanced ? 'status-ok' : 'status-warn')}>
            {balanced ? 'System balanced' : 'Imbalance detected'}
          </span>
          <button className="btn btn-primary" onClick={() => processCycle(1)}>
            ▶ Run [3-6-9] Cycle
          </button>
        </div>
      </header>

      <nav className="app-nav">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            className={classNames('nav-item', { active: view === v.id })}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        <ActiveView />
      </main>
    </div>
  );
}
