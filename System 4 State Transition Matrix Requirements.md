# System 4 State Transition Matrix Requirements

## Overview

System 4 implements a sophisticated state transition model with two types of sets operating at different synchronization patterns:

### 1. Universal Sets (2 sets)
- **Count**: 2 synchronous universal sets
- **Pattern**: Alternate double steps
- **Behavior**: Each universal set takes 2 steps, then alternates to the other set
- **Synchronization**: Synchronous - they coordinate their transitions

### 2. Particular Sets (3 sets)
- **Count**: 3 concurrent particular sets
- **Pattern**: 4 steps apart
- **Behavior**: Each particular set operates independently, offset by 4 steps from each other
- **Synchronization**: Concurrent - they run in parallel

## State Transition Pattern Analysis

### Universal Sets Pattern (Alternate Double Steps)

**Set U1 and Set U2**:
```
Time:  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
U1:    A  B  -  -  C  D  -  -  E  F  -  -  G  H  -  -
U2:    -  -  A  B  -  -  C  D  -  -  E  F  -  -  G  H
```

Pattern:
- U1 takes steps at t=0,1 (double step)
- U2 takes steps at t=2,3 (double step)
- U1 takes steps at t=4,5 (double step)
- U2 takes steps at t=6,7 (double step)
- Continues alternating...

### Particular Sets Pattern (4 Steps Apart)

**Set P1, P2, and P3**:
```
Time:  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
P1:    A  -  -  -  B  -  -  -  C  -  -  -  D  -  -  -  E  -  -  -  F
P2:    -  A  -  -  -  B  -  -  -  C  -  -  -  D  -  -  -  E  -  -  -
P3:    -  -  A  -  -  -  B  -  -  -  C  -  -  -  D  -  -  -  E  -  -
```

Pattern:
- P1 takes steps at t=0, 4, 8, 12, 16, 20... (every 4 time units)
- P2 takes steps at t=1, 5, 9, 13, 17, 21... (every 4 time units, offset by 1)
- P3 takes steps at t=2, 6, 10, 14, 18, 22... (every 4 time units, offset by 2)

## State Space Definition

### Universal Set States

Each universal set can be in one of several states representing different cognitive or processing modes:

**U1 States**: {U1_S0, U1_S1, U1_S2, U1_S3, U1_S4}
**U2 States**: {U2_S0, U2_S1, U2_S2, U2_S3, U2_S4}

### Particular Set States

Each particular set can be in one of several states:

**P1 States**: {P1_S0, P1_S1, P1_S2, P1_S3}
**P2 States**: {P2_S0, P2_S1, P2_S2, P2_S3}
**P3 States**: {P3_S0, P3_S1, P3_S2, P3_S3}

## Transition Matrices

### Universal Set Transition Matrix (5x5)

For each universal set, transitions follow a probabilistic or deterministic pattern:

```
         S0    S1    S2    S3    S4
    S0 [ 0.1   0.4   0.3   0.1   0.1 ]
    S1 [ 0.2   0.2   0.3   0.2   0.1 ]
    S2 [ 0.1   0.2   0.2   0.3   0.2 ]
    S3 [ 0.1   0.1   0.2   0.3   0.3 ]
    S4 [ 0.2   0.1   0.1   0.2   0.4 ]
```

### Particular Set Transition Matrix (4x4)

For each particular set:

```
         S0    S1    S2    S3
    S0 [ 0.3   0.4   0.2   0.1 ]
    S1 [ 0.2   0.3   0.3   0.2 ]
    S2 [ 0.1   0.2   0.4   0.3 ]
    S3 [ 0.2   0.2   0.2   0.4 ]
```

## Combined System State

The complete System 4 state at any time t is:

**State(t) = (U1(t), U2(t), P1(t), P2(t), P3(t))**

This creates a composite state space of size: 5 × 5 × 4 × 4 × 4 = 2000 possible states

## Synchronization Constraints

### Universal Set Synchronization
- U1 and U2 must alternate their double steps
- When U1 is active (taking 2 steps), U2 is inactive
- When U2 is active (taking 2 steps), U1 is inactive
- Synchronization ensures no overlap in universal set transitions

### Particular Set Concurrency
- P1, P2, and P3 operate independently
- Each maintains its own 4-step cycle
- No synchronization required between particular sets
- Offset by 1 time unit creates a staggered pattern

## Implementation Requirements

### Data Structures
1. **State Vectors**: Represent current state of each set
2. **Transition Matrices**: Store transition probabilities for each set
3. **Time Scheduler**: Manage when each set can transition
4. **State History**: Track state evolution over time

### Algorithms
1. **Universal Set Scheduler**: Implements alternate double-step pattern
2. **Particular Set Scheduler**: Implements 4-step concurrent pattern
3. **State Transition Engine**: Applies transition matrices at appropriate times
4. **Synchronization Manager**: Ensures universal sets alternate correctly

### Cognitive Tensor Mapping
- Each set state can be represented as a cognitive tensor
- Transition matrices can be stored as 2D cognitive tensors
- Attention values can prioritize certain states
- Strength and confidence can represent transition certainty

## Expected Behavior

Over a 20-time-unit simulation:

**Universal Sets**:
- U1 transitions at: t=0, 1, 4, 5, 8, 9, 12, 13, 16, 17
- U2 transitions at: t=2, 3, 6, 7, 10, 11, 14, 15, 18, 19

**Particular Sets**:
- P1 transitions at: t=0, 4, 8, 12, 16, 20
- P2 transitions at: t=1, 5, 9, 13, 17
- P3 transitions at: t=2, 6, 10, 14, 18

## Visualization Requirements

The implementation should support:
1. **State Timeline**: Show state of all sets over time
2. **Transition Graph**: Visualize state transitions as directed graph
3. **Synchronization Diagram**: Show when each set is active
4. **Probability Heatmap**: Display transition matrix probabilities
