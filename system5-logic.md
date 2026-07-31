# System 5 Logic Formalization

## Structure

- **Total Sets**: 7
- **Universal Sets (U)**: 3 (U1, U2, U3)
- **Particular Sets (P)**: 4 (P1, P2, P3, P4)

## Timing (Cycle Length: 60 steps)

The overall cycle is determined by the LCM of the Universal cycle (3 steps) and the Particular cycle (5 steps, staggered over 4 sets). We will simulate a 60-step cycle (LCM of 3 and 20) to capture the full interaction.

### Universal Sets (U1, U2, U3)

- **Pattern**: Sequential, one set transitions per step.
- **Cycle**: 3 steps.
- **Logic**:
    - U1 transitions at $t \equiv 0 \pmod 3$
    - U2 transitions at $t \equiv 1 \pmod 3$
    - U3 transitions at $t \equiv 2 \pmod 3$

### Particular Sets (P1, P2, P3, P4)

- **Pattern**: Staggered, 5-step cycle with 4 sets.
- **Cycle**: 20 steps (LCM of 4 sets staggered over 5 steps).
- **Logic**:
    - P1 transitions at $t \equiv 0 \pmod 5$
    - P2 transitions at $t \equiv 1 \pmod 5$
    - P3 transitions at $t \equiv 2 \pmod 5$
    - P4 transitions at $t \equiv 3 \pmod 5$
    - $t \equiv 4 \pmod 5$ is a rest step.

## Nested Concurrency (The Convolution)

The transition of a Particular Set $P_i$ is dependent on the current states of the other Particular Sets $P_j$ (where $j \neq i$).

### State Representation

Since the specific state labels are unknown, we will use a simplified integer state representation for the Particular Sets (e.g., 0, 1, 2, 3) and a simplified string for Universal Sets (e.g., U1-A, U2-B).

### Dependency Logic

1.  **Universal Transitions**: U1, U2, U3 transitions are independent of each other and the Particular Sets. They are the **Primary Universal** (Points).
2.  **Particular Transitions**: The transition task for $P_i$ will have a dependency on the state-reading tasks of $P_j$ (where $j \neq i$) from the *current* time step.

**The Convolution Function (Simplified)**:
The next state of $P_i$ will be determined by a simple function of the current states of all other sets.

Let $S_i(t)$ be the state of set $i$ at time $t$.
Let $T_i$ be the transition function for set $i$.

$$S_i(t+1) = T_i(S_i(t), \sum_{j \neq i} S_j(t))$$

In the implementation, we will use a simple XOR-like operation on the integer states to model the "convolution" effect.

- **P1 Next State**: $S_{P1}(t+1) = (S_{P1}(t) + S_{P2}(t) + S_{P3}(t) + S_{P4}(t)) \pmod 4$
- **P2 Next State**: $S_{P2}(t+1) = (S_{P2}(t) + S_{P1}(t) + S_{P3}(t) + S_{P4}(t)) \pmod 4$
- ...and so on.

This creates a **dependency graph** where all Particular Set transitions must read the states of all other Particular Sets before calculating their own next state. Since they are concurrent, this requires careful task scheduling in CogTaskFlow.

### CogTaskFlow Task Graph

For a time step $t$:

1.  **Universal Tasks**: U1, U2, U3 transition tasks run in parallel.
2.  **Particular Read Tasks**: P1-Read, P2-Read, P3-Read, P4-Read tasks read the current state of each Particular Set.
3.  **Particular Transition Tasks**: P1-Trans, P2-Trans, P3-Trans, P4-Trans tasks:
    - P1-Trans depends on P2-Read, P3-Read, P4-Read.
    - P2-Trans depends on P1-Read, P3-Read, P4-Read.
    - ...and so on.
4.  **Final State Update**: All transition tasks update their respective set's state.
