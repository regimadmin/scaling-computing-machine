import { create } from 'zustand';
import { TriadicSystem, TRIADS, DIMENSIONS } from '../core/index.js';

/**
 * Zustand store wrapping the TriadicSystem core model. The mutable
 * TriadicSystem instance lives outside React state; each mutation
 * refreshes an immutable snapshot that components subscribe to.
 */
const system = new TriadicSystem();

const snapshot = () => system.snapshot();

export const useSystemStore = create((set, get) => ({
  triads: TRIADS,
  dimensions: DIMENSIONS,
  snapshot: snapshot(),
  cycles: 0,
  log: [],

  refresh() {
    set({ snapshot: snapshot() });
  },

  appendLog(message) {
    set((state) => ({
      log: [{ message, timestamp: Date.now() }, ...state.log].slice(0, 50),
    }));
  },

  processCycle(energy = 1) {
    system.processCycle(energy);
    set((state) => ({ cycles: state.cycles + 1 }));
    get().appendLog(`Processed [3-6-9] cycle with energy ${energy}`);
    get().refresh();
  },

  addRnFlow(spec) {
    system.addRnFlow(spec);
    get().appendLog(`Created relational whole ${spec.id}: ${spec.serviceA} ⇄ ${spec.serviceB} (pivot ${spec.pivot})`);
    get().refresh();
  },

  removeRnFlow(id) {
    system.removeRnFlow(id);
    get().appendLog(`Removed relational whole ${id}`);
    get().refresh();
  },

  runRnForward(id, energy = 1) {
    system.getRnFlow(id)?.forwardFlow(energy);
    get().appendLog(`${id}: R1 forward flow (+${energy})`);
    get().refresh();
  },

  runRnBackward(id, energy = 1) {
    system.getRnFlow(id)?.backwardFlow(energy);
    get().appendLog(`${id}: R2 backward flow (+${energy})`);
    get().refresh();
  },

  rebalanceRn(id) {
    system.getRnFlow(id)?.checkBalance();
    get().appendLog(`${id}: countercurrent balance restored`);
    get().refresh();
  },

  addPkFlow(spec) {
    system.addPkFlow(spec);
    get().appendLog(`Created projection ${spec.id} (${spec.kind}): ${spec.stages.join(' → ')}`);
    get().refresh();
  },

  removePkFlow(id) {
    system.removePkFlow(id);
    get().appendLog(`Removed projection ${id}`);
    get().refresh();
  },

  runPkFlow(id, value = 1) {
    system.getPkFlow(id)?.flow(value);
    get().appendLog(`${id}: projected ${value} unit(s) through pipeline`);
    get().refresh();
  },
}));
