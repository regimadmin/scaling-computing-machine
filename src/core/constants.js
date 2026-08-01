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
 * Pentachoral vertex definitions.
 *
 * The tetrahedral System 5 (analysis §7.1: 4 vertices, 6 edges, 4
 * faces) is enhanced to a pentachoron (5-cell / 4-simplex) by
 * formalizing the shared P-5 core as the explicit Integration vertex
 * and promoting the external `external.*` boundary anchors to a
 * first-class Environmental vertex: 5 vertices, 10 edges, 10 triadic
 * faces and 5 tetrahedral cells (complementarity threads of 4-of-5
 * vertices, extending §7.2's 3-of-4 threads).
 */
export const INTEGRATION_VERTEX = {
  id: 'integration',
  name: 'Integration',
  label: 'Integration Core',
  color: '#b48ce0',
  polarity: 'Coherence',
  description: 'Shared P-5 processing core — universal integration point for all triads',
  services: [
    { id: 'shared.P-5', code: 'P-5', name: 'Shared Processing Core', role: 'Cross-triad coordination, common processing substrate' },
  ],
};

export const ENVIRONMENTAL_VERTEX = {
  id: 'environmental',
  name: 'Environmental',
  label: 'Environmental Boundary',
  color: '#8bc56f',
  polarity: 'Exchange',
  description: 'External interface boundary — reception and exchange with the world',
  services: [
    { id: 'external.gateway', code: 'GW', name: 'Gateway', role: 'User request reception and response exchange' },
    { id: 'external.environment', code: 'ENV', name: 'Environment', role: 'Environmental stimuli source, behavioral sink' },
    { id: 'external.metrics', code: 'MET', name: 'Metrics', role: 'System vital-sign emission' },
    { id: 'external.responses', code: 'RSP', name: 'Responses', role: 'Automatic response delivery to the world' },
  ],
};

/** All five pentachoral vertices: the three triads + Integration + Environmental. */
export const VERTICES = {
  ...TRIADS,
  integration: INTEGRATION_VERTEX,
  environmental: ENVIRONMENTAL_VERTEX,
};

/** Resolve a vertex service to its fully qualified id (explicit ids win). */
export function vertexServiceId(vertex, service) {
  return service.id ?? serviceId(vertex.id, service.code);
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
 * Exchange dimension contributed by the Environmental vertex: boundary
 * reception (3) flowing into the shared Integration core (6), completing
 * the [3-6-9] number set left open by the original three dimensions.
 */
export const EXCHANGE_DIMENSION = {
  id: 'E-I',
  name: 'Exchange [E-I] (3-6)',
  from: 'GW',
  to: 'P-5',
  nature: 'Boundary reception, world exchange integrated in the shared core',
};

/** The extended pentachoral dimension set (original three + Exchange). */
export const PENTACHORAL_DIMENSIONS = [...DIMENSIONS, EXCHANGE_DIMENSION];

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
 * Cross-triad Relational Wholes (section 3.6) forming the original
 * tetrahedral edges. All are pivoted through the shared P-5 processing
 * core.
 */
const TETRAHEDRAL_EDGE_RN_FLOWS = [
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
 * Explicit triad ⇄ Integration edges (analysis §7.1 C/S/A-Integration),
 * previously only implicit in the shared P-5 pivot.
 */
export const INTEGRATION_RN_FLOWS = [
  {
    id: 'R_CI',
    name: 'Analytical Integration (C⇄I)',
    triad: 'integration',
    serviceA: serviceId('cerebral', 'P-5'),
    serviceB: 'shared.P-5',
    pivot: serviceId('cerebral', 'PD-2'),
    description: 'Cerebral analytical processing coalesces with the shared core',
  },
  {
    id: 'R_SI',
    name: 'Behavioral Integration (S⇄I)',
    triad: 'integration',
    serviceA: serviceId('somatic', 'P-5'),
    serviceB: 'shared.P-5',
    pivot: serviceId('somatic', 'M-1'),
    description: 'Somatic behavioral processing coalesces with the shared core',
  },
  {
    id: 'R_AI',
    name: 'Emotive Integration (A⇄I)',
    triad: 'integration',
    serviceA: serviceId('autonomic', 'P-5'),
    serviceB: 'shared.P-5',
    pivot: serviceId('autonomic', 'PD-2'),
    description: 'Autonomic emotive processing coalesces with the shared core',
  },
];

/** Edges from the 5th (Environmental) vertex to each of the other four. */
export const ENVIRONMENTAL_RN_FLOWS = [
  {
    id: 'R_CE',
    name: 'Cognitive Exchange (C⇄E)',
    triad: 'environmental',
    serviceA: 'external.gateway',
    serviceB: serviceId('cerebral', 'O-4'),
    pivot: serviceId('cerebral', 'T-7'),
    description: 'User requests balanced against cognitive responses',
  },
  {
    id: 'R_SE',
    name: 'Behavioral Exchange (S⇄E)',
    triad: 'environmental',
    serviceA: 'external.environment',
    serviceB: serviceId('somatic', 'O-4'),
    pivot: serviceId('somatic', 'S-8'),
    description: 'Environmental stimuli balanced against motor responses',
  },
  {
    id: 'R_AE',
    name: 'Regulatory Exchange (A⇄E)',
    triad: 'environmental',
    serviceA: 'external.metrics',
    serviceB: serviceId('autonomic', 'T-7'),
    pivot: serviceId('autonomic', 'M-1'),
    description: 'System vitals balanced against reflex triggers',
  },
  {
    id: 'R_IE',
    name: 'Core Exchange (I⇄E)',
    triad: 'environmental',
    serviceA: 'shared.P-5',
    serviceB: 'external.responses',
    pivot: serviceId('autonomic', 'PD-2'),
    description: 'Integrated emissions balanced against world feedback',
  },
];

/** The 7 pentachoral enhancement edges (triad⇄Integration + Environmental). */
export const PENTACHORAL_RN_FLOWS = [...INTEGRATION_RN_FLOWS, ...ENVIRONMENTAL_RN_FLOWS];

/**
 * All 10 cross-vertex Rn edges completing the K5 pentachoral skeleton:
 * the 3 original tetrahedral edges plus the 7 pentachoral enhancement
 * edges. The historical export name is kept for backward compatibility.
 */
export const CROSS_TRIAD_RN_FLOWS = [...TETRAHEDRAL_EDGE_RN_FLOWS, ...PENTACHORAL_RN_FLOWS];

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
  {
    id: 'P1_E',
    name: 'Environmental Reception',
    triad: 'environmental',
    kind: 'revenue',
    stages: ['external.environment', 'external.gateway', 'shared.P-5'],
    description: 'World signals received at the boundary and integrated in the shared core',
  },
  {
    id: 'P2_E',
    name: 'Environmental Emission',
    triad: 'environmental',
    kind: 'expenditure',
    stages: ['shared.P-5', 'external.responses', 'external.environment'],
    description: 'Integrated responses emitted through the boundary back to the world',
  },
];

/** [3-6-9] cognitive topology: closed Potential → Commitment → Performance loop. */
export const COGNITIVE_TOPOLOGY = ['cerebral', 'somatic', 'autonomic'];

/**
 * PENTACHORON — the 5-cell (4-simplex) topology of the enhanced System 5.
 *
 * 5 vertices, C(5,2)=10 edges (each mapped to an Rn flow), C(5,3)=10
 * triadic faces (the first four are §7.1's tetrahedral faces) and
 * C(5,4)=5 tetrahedral cells, each identified by its omitted vertex —
 * the complementarity threads of 4-of-5 vertices.
 */
export const PENTACHORON = {
  vertices: ['cerebral', 'somatic', 'autonomic', 'integration', 'environmental'],
  edges: [
    { id: 'C-S', vertices: ['cerebral', 'somatic'], rn: 'R_CS' },
    { id: 'S-A', vertices: ['somatic', 'autonomic'], rn: 'R_SA' },
    { id: 'A-C', vertices: ['autonomic', 'cerebral'], rn: 'R_AC' },
    { id: 'C-I', vertices: ['cerebral', 'integration'], rn: 'R_CI' },
    { id: 'S-I', vertices: ['somatic', 'integration'], rn: 'R_SI' },
    { id: 'A-I', vertices: ['autonomic', 'integration'], rn: 'R_AI' },
    { id: 'C-E', vertices: ['cerebral', 'environmental'], rn: 'R_CE' },
    { id: 'S-E', vertices: ['somatic', 'environmental'], rn: 'R_SE' },
    { id: 'A-E', vertices: ['autonomic', 'environmental'], rn: 'R_AE' },
    { id: 'I-E', vertices: ['integration', 'environmental'], rn: 'R_IE' },
  ],
  faces: [
    { id: 'F_CSA', vertices: ['cerebral', 'somatic', 'autonomic'], name: 'Cognitive Triad', note: 'The [3-6-9] Potential → Commitment → Performance loop (§7.1 Face 1)' },
    { id: 'F_CSI', vertices: ['cerebral', 'somatic', 'integration'], name: 'Executive-Behavioral Integration', note: 'Cerebral-Somatic integration through P-5 (§7.1 Face 2)' },
    { id: 'F_SAI', vertices: ['somatic', 'autonomic', 'integration'], name: 'Behavioral-Autonomic Integration', note: 'Somatic-Autonomic integration through P-5 (§7.1 Face 3)' },
    { id: 'F_ACI', vertices: ['autonomic', 'cerebral', 'integration'], name: 'Autonomic-Executive Integration', note: 'Autonomic-Cerebral integration through P-5 (§7.1 Face 4)' },
    { id: 'F_CSE', vertices: ['cerebral', 'somatic', 'environmental'], name: 'Cognitive-Behavioral Exchange', note: 'Cognition and action meeting the environmental boundary' },
    { id: 'F_SAE', vertices: ['somatic', 'autonomic', 'environmental'], name: 'Behavioral-Regulatory Exchange', note: 'Action and regulation meeting the environmental boundary' },
    { id: 'F_ACE', vertices: ['autonomic', 'cerebral', 'environmental'], name: 'Regulatory-Cognitive Exchange', note: 'Regulation and cognition meeting the environmental boundary' },
    { id: 'F_CIE', vertices: ['cerebral', 'integration', 'environmental'], name: 'Cerebral Boundary Integration', note: 'Cognitive core-boundary mediation' },
    { id: 'F_SIE', vertices: ['somatic', 'integration', 'environmental'], name: 'Somatic Boundary Integration', note: 'Behavioral core-boundary mediation' },
    { id: 'F_AIE', vertices: ['autonomic', 'integration', 'environmental'], name: 'Autonomic Boundary Integration', note: 'Regulatory core-boundary mediation' },
  ],
  cells: [
    { id: 'cognitive-core', short: 'T1', name: 'Cognitive Core', omits: 'environmental', vertices: ['cerebral', 'somatic', 'autonomic', 'integration'], description: 'The original System 5 tetrahedron (§7.1): triads integrating through the shared core' },
    { id: 'embodied-exchange', short: 'T2', name: 'Embodied Exchange', omits: 'integration', vertices: ['cerebral', 'somatic', 'autonomic', 'environmental'], description: 'Triads exchanging directly with the environmental boundary' },
    { id: 'deliberate-action', short: 'T3', name: 'Deliberate Action', omits: 'autonomic', vertices: ['cerebral', 'somatic', 'integration', 'environmental'], description: 'Cognition driving behavior through core and boundary' },
    { id: 'reflexive-regulation', short: 'T4', name: 'Reflexive Regulation', omits: 'cerebral', vertices: ['somatic', 'autonomic', 'integration', 'environmental'], description: 'Autonomic regulation of behavior through core and boundary' },
    { id: 'integrative-rest', short: 'REST', name: 'Integrative Rest', omits: 'somatic', vertices: ['cerebral', 'autonomic', 'integration', 'environmental'], description: 'Action-free contemplation cell — the rest/global-rebalance step' },
  ],
};

/**
 * Staggered 5-step pentachoral cycle, following the tensor-bundle
 * timing of the System 5 hierarchical documentation: cells T1–T4
 * transition at t ≡ 0..3 (mod 5) and t ≡ 4 (mod 5) is the rest step
 * (global countercurrent rebalance). The [3-6-9] loop is preserved as
 * the C-S-A face of the pentachoron.
 */
export const PENTACHORAL_CYCLE = [
  { phase: 0, cell: 'cognitive-core', mode: 'active', description: 'T1 transitions (t ≡ 0 mod 5)' },
  { phase: 1, cell: 'embodied-exchange', mode: 'active', description: 'T2 transitions (t ≡ 1 mod 5)' },
  { phase: 2, cell: 'deliberate-action', mode: 'active', description: 'T3 transitions (t ≡ 2 mod 5)' },
  { phase: 3, cell: 'reflexive-regulation', mode: 'active', description: 'T4 transitions (t ≡ 3 mod 5)' },
  { phase: 4, cell: 'integrative-rest', mode: 'rest', description: 'Rest step — global countercurrent rebalance (t ≡ 4 mod 5)' },
];
