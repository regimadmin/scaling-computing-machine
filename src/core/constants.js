/**
 * Cosmos System 5 — canonical architecture definitions.
 *
 * Encodes the triadic architecture (Cerebral, Somatic, Autonomic), the
 * services distributed across the triads, the dimensional flow mappings
 * ([D-T] Potential, [P-O] Commitment, [S-M] Performance) and the default
 * intra-/inter-triad Relational Whole (Rn) and Projection (Pk) flows
 * described in the "Comprehensive Analysis: Relational Wholes (Rn) &
 * Projections (Pk) in Cosmos System Architecture".
 */

export const TRIADS = {
  cerebral: {
    id: 'cerebral',
    name: 'Cerebral',
    color: '#f5c542',
    polarity: 'Potential',
    description: 'Neocortex executive functions — creative ideation',
    services: [
      { code: 'T-7', name: 'Thought Service', role: 'Intuitive idea generation, creative potential' },
      { code: 'PD-2', name: 'Processing Director', role: 'Central coordination, executive control' },
      { code: 'P-5', name: 'Processing Service', role: 'Analytical processing, logical analysis' },
      { code: 'O-4', name: 'Output Service', role: 'Structured output, formatted responses' },
    ],
  },
  somatic: {
    id: 'somatic',
    name: 'Somatic',
    color: '#7ec8e3',
    polarity: 'Commitment',
    description: 'Basal system motor control — action implementation',
    services: [
      { code: 'M-1', name: 'Motor Control', role: 'Action coordination, movement sequencing' },
      { code: 'S-8', name: 'Sensory Service', role: 'Environmental input processing, perception' },
      { code: 'P-5', name: 'Processing Service', role: 'Behavioral technique implementation' },
      { code: 'O-4', name: 'Output Service', role: 'Motor response delivery, action execution' },
    ],
  },
  autonomic: {
    id: 'autonomic',
    name: 'Autonomic',
    color: '#40e0d0',
    polarity: 'Performance',
    description: 'Limbic system background processes — system maintenance',
    services: [
      { code: 'M-1', name: 'Monitoring Service', role: 'System health monitoring, vital signs' },
      { code: 'S-8', name: 'State Management', role: 'Emotional state, memory, context' },
      { code: 'PD-2', name: 'Process Director', role: 'Background orchestration, homeostasis' },
      { code: 'P-5', name: 'Processing Service', role: 'Emotive processing, intuitive responses' },
      { code: 'T-7', name: 'Trigger Service', role: 'Automatic responses, reflexive reactions' },
    ],
  },
};

/** Fully qualified service id, e.g. "cerebral.T-7". */
export function serviceId(triadId, code) {
  return `${triadId}.${code}`;
}

/**
 * Dimensional flow mappings (section 6).
 * [D-T] Potential: Development (2) → Treasury (7)
 * [P-O] Commitment: Production (5) → Organization (4)
 * [S-M] Performance: Sales/State (8) → Market (1)
 */
export const DIMENSIONS = [
  { id: 'D-T', name: 'Potential [D-T] (2-7)', from: 'PD-2', to: 'T-7', nature: 'Creative potential, idea generation, resource development' },
  { id: 'P-O', name: 'Commitment [P-O] (5-4)', from: 'P-5', to: 'O-4', nature: 'Action implementation, skill execution, structured output' },
  { id: 'S-M', name: 'Performance [S-M] (8-1)', from: 'S-8', to: 'M-1', nature: 'Environmental interaction, state management, optimization' },
];

/**
 * Default intra-triad Relational Wholes (section 3.6).
 * Each entry defines a closed circuit: serviceA ⇄ (pivot) ⇄ serviceB.
 */
export const DEFAULT_RN_FLOWS = [
  {
    id: 'R_C',
    name: 'Cerebral Thought ⇄ Output',
    triad: 'cerebral',
    serviceA: serviceId('cerebral', 'T-7'),
    serviceB: serviceId('cerebral', 'O-4'),
    pivot: serviceId('cerebral', 'PD-2'),
    description: 'R1: idea generation to structured output; R2: output feedback refines ideas',
  },
  {
    id: 'R_S',
    name: 'Somatic Sensory ⇄ Response',
    triad: 'somatic',
    serviceA: serviceId('somatic', 'S-8'),
    serviceB: serviceId('somatic', 'O-4'),
    pivot: serviceId('somatic', 'M-1'),
    description: 'R1: sensory input to motor response; R2: response feedback refines sensing',
  },
  {
    id: 'R_A',
    name: 'Autonomic Monitoring ⇄ Trigger',
    triad: 'autonomic',
    serviceA: serviceId('autonomic', 'M-1'),
    serviceB: serviceId('autonomic', 'T-7'),
    pivot: serviceId('autonomic', 'PD-2'),
    description: 'R1: monitoring to automatic triggers; R2: trigger feedback refines monitoring',
  },
];

/**
 * Cross-triad Relational Wholes (section 3.6) forming the tetrahedral
 * edges. All are pivoted through the shared P-5 processing core.
 */
export const CROSS_TRIAD_RN_FLOWS = [
  {
    id: 'R_CS',
    name: 'Behavioral Directives (C→S)',
    triad: 'cross',
    serviceA: serviceId('cerebral', 'O-4'),
    serviceB: serviceId('somatic', 'S-8'),
    pivot: 'shared.P-5',
    description: 'Cognitive decisions direct behavioral actions',
  },
  {
    id: 'R_SA',
    name: 'Performance Data (S→A)',
    triad: 'cross',
    serviceA: serviceId('somatic', 'O-4'),
    serviceB: serviceId('autonomic', 'M-1'),
    pivot: 'shared.P-5',
    description: 'Behavioral performance informs system health monitoring',
  },
  {
    id: 'R_AC',
    name: 'Emotional Context (A→C)',
    triad: 'cross',
    serviceA: serviceId('autonomic', 'T-7'),
    serviceB: serviceId('cerebral', 'T-7'),
    pivot: 'shared.P-5',
    description: 'Emotional states inform cognitive processing',
  },
];

/**
 * Default triad projections (section 4.5) — open, unidirectional paths.
 * P1 pipelines account inputs (revenue); P2 pipelines account outputs
 * (expenditure). Together they form each triad's balance sheet.
 */
export const DEFAULT_PK_FLOWS = [
  {
    id: 'P1_C',
    name: 'Cerebral Input',
    triad: 'cerebral',
    kind: 'revenue',
    stages: ['external.gateway', serviceId('cerebral', 'T-7'), serviceId('cerebral', 'PD-2'), serviceId('cerebral', 'P-5'), serviceId('cerebral', 'O-4')],
    description: 'External requests through cognitive processing',
  },
  {
    id: 'P2_C',
    name: 'Cerebral Output',
    triad: 'cerebral',
    kind: 'expenditure',
    stages: [serviceId('cerebral', 'O-4'), 'external.gateway'],
    description: 'Cognitive results to users',
  },
  {
    id: 'P1_S',
    name: 'Somatic Sensory Input',
    triad: 'somatic',
    kind: 'revenue',
    stages: ['external.environment', serviceId('somatic', 'S-8'), serviceId('somatic', 'M-1'), serviceId('somatic', 'P-5'), serviceId('somatic', 'O-4')],
    description: 'Environmental data through behavioral processing',
  },
  {
    id: 'P2_S',
    name: 'Somatic Motor Output',
    triad: 'somatic',
    kind: 'expenditure',
    stages: [serviceId('somatic', 'O-4'), 'external.environment'],
    description: 'Behavioral responses to environment',
  },
  {
    id: 'P1_A',
    name: 'Autonomic Monitoring Input',
    triad: 'autonomic',
    kind: 'revenue',
    stages: ['external.metrics', serviceId('autonomic', 'M-1'), serviceId('autonomic', 'S-8'), serviceId('autonomic', 'PD-2'), serviceId('autonomic', 'P-5'), serviceId('autonomic', 'T-7')],
    description: 'System health data through background processing',
  },
  {
    id: 'P2_A',
    name: 'Autonomic Trigger Output',
    triad: 'autonomic',
    kind: 'expenditure',
    stages: [serviceId('autonomic', 'T-7'), 'external.responses'],
    description: 'Automatic responses to system',
  },
];

/** [3-6-9] cognitive topology: closed Potential → Commitment → Performance loop. */
export const COGNITIVE_TOPOLOGY = ['cerebral', 'somatic', 'autonomic'];
