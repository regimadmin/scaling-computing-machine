import express from 'express';
import cors from 'cors';
import http from 'node:http';
import { WebSocketServer } from 'ws';
import { TriadicSystem, TRIADS, VERTICES, PENTACHORAL_DIMENSIONS } from './src/core/index.js';

/**
 * Cosmos System Interface — backend API server.
 *
 * Exposes the TriadicSystem core model over REST routes and broadcasts
 * state snapshots over WebSocket (the "bidirectional message channel"
 * guideline of section 8.1) so clients can monitor Rn countercurrent
 * balance and the Pk balance sheet in real time.
 */
const app = express();
app.use(cors());
app.use(express.json());

const system = new TriadicSystem();

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcast() {
  const payload = JSON.stringify({ type: 'snapshot', snapshot: system.snapshot() });
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(payload);
    }
  }
}

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'snapshot', snapshot: system.snapshot() }));
});

/** Wrap a mutating handler: run it, broadcast the new state, return the snapshot. */
function mutate(handler) {
  return (req, res) => {
    try {
      const result = handler(req);
      broadcast();
      res.json({ ok: true, result, snapshot: system.snapshot() });
    } catch (error) {
      res.status(400).json({ ok: false, error: error.message });
    }
  };
}

app.get('/api/system', (req, res) => {
  res.json(system.snapshot());
});

app.get('/api/triads', (req, res) => {
  res.json({ triads: TRIADS, vertices: VERTICES, dimensions: PENTACHORAL_DIMENSIONS });
});

app.get('/api/pentachoron', (req, res) => {
  const snap = system.snapshot();
  res.json({ ...snap.pentachoron, cycle: snap.cycle });
});

app.get('/api/rn', (req, res) => {
  res.json(system.listRnFlows().map((rn) => rn.toJSON()));
});

app.post('/api/rn', mutate((req) => system.addRnFlow(req.body).toJSON()));

app.delete('/api/rn/:id', mutate((req) => {
  if (!system.removeRnFlow(req.params.id)) {
    throw new Error(`Relational whole '${req.params.id}' not found`);
  }
  return { removed: req.params.id };
}));

app.post('/api/rn/:id/forward', mutate((req) => {
  const rn = system.getRnFlow(req.params.id);
  if (!rn) throw new Error(`Relational whole '${req.params.id}' not found`);
  return rn.forwardFlow(Number(req.body?.energy) || 1, req.body?.data ?? null);
}));

app.post('/api/rn/:id/backward', mutate((req) => {
  const rn = system.getRnFlow(req.params.id);
  if (!rn) throw new Error(`Relational whole '${req.params.id}' not found`);
  return rn.backwardFlow(Number(req.body?.energy) || 1, req.body?.data ?? null);
}));

app.post('/api/rn/:id/balance', mutate((req) => {
  const rn = system.getRnFlow(req.params.id);
  if (!rn) throw new Error(`Relational whole '${req.params.id}' not found`);
  return { imbalance: rn.checkBalance(), balanced: rn.balanced };
}));

app.get('/api/pk', (req, res) => {
  res.json(system.listPkFlows().map((pk) => pk.toJSON()));
});

app.post('/api/pk', mutate((req) => system.addPkFlow(req.body).toJSON()));

app.delete('/api/pk/:id', mutate((req) => {
  if (!system.removePkFlow(req.params.id)) {
    throw new Error(`Projection '${req.params.id}' not found`);
  }
  return { removed: req.params.id };
}));

app.post('/api/pk/:id/flow', mutate((req) => {
  const pk = system.getPkFlow(req.params.id);
  if (!pk) throw new Error(`Projection '${req.params.id}' not found`);
  return pk.flow(Number(req.body?.value) || 1, req.body?.data ?? null);
}));

app.get('/api/balance-sheet', (req, res) => {
  res.json(system.accounting.compareBalance());
});

app.post('/api/cycle', mutate((req) => system.processCycle(Number(req.body?.energy) || 1)));

app.post('/api/step', mutate((req) => system.stepCycle(Number(req.body?.energy) || 1)));

const PORT = Number(process.env.PORT) || 3001;
server.listen(PORT, () => {
  console.log(`Cosmos System API listening on http://localhost:${PORT}`);
});
