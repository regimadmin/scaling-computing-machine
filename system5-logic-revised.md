# System 5 Logic Formalization (Revised)

## Structure

- **Total Sets**: 7
- **Universal Sets (U)**: 3 (U1, U2, U3)
- **Particular Sets (P)**: 4 (P1, P2, P3, P4)

## Timing (Cycle Length: 60 steps)

### Universal Sets (U1, U2, U3)

- **Pattern**: Sequential, one set transitions per step.
- **Logic**:
    - U1 transitions at $t \equiv 0 \pmod 3$
    - U2 transitions at $t \equiv 1 \pmod 3$
    - U3 transitions at $t \equiv 2 \pmod 3$
- **State**: U1, U2, U3 states are determined by the index $t \pmod 3$.

### Particular Sets (P1, P2, P3, P4)

- **Pattern**: Staggered, 5-step cycle with 4 sets.
- **Logic**:
    - P1 transitions at $t \equiv 0 \pmod 5$
    - P2 transitions at $t \equiv 1 \pmod 5$
    - P3 transitions at $t \equiv 2 \pmod 5$
    - P4 transitions at $t \equiv 3 \pmod 5$
    - $t \equiv 4 \pmod 5$ is a rest step.

## Nested Concurrency (Revised Convolution)

The transition of a Particular Set $P_i$ is dependent on the current states of the other Particular Sets $P_j$ (where $j \neq i$) AND the current Universal Set index to break the initial symmetry.

Let $S_i(t)$ be the state of set $i$ at time $t$.
Let $U_{idx}(t) = t \pmod 3$ be the index of the active Universal Set.

### Revised Transition Function

The next state of $P_i$ is calculated as:

$$S_{i}(t+1) = (S_{i}(t) + \sum_{j \neq i} S_{j}(t) + U_{idx}(t)) \pmod 4$$

This function ensures that even if all Particular Sets are at state 0, the Universal Set's influence will trigger a state change in the active Particular Set.

### CogTaskFlow Task Graph

The dependency graph remains the same, but the transition function logic is updated:

1.  **Universal Tasks**: U1, U2, U3 transition tasks run in parallel.
2.  **Particular Read Tasks**: P1-Read, P2-Read, P3-Read, P4-Read tasks read the current state of each Particular Set.
3.  **Particular Transition Tasks**: P1-Trans, P2-Trans, P3-Trans, P4-Trans tasks:
    - P_i-Trans depends on P_j-Read for all $j \neq i$.
    - P_i-Trans uses the current time step $t$ to calculate $U_{idx}(t)$.
4.  **Final State Update**: All transition tasks update their respective set's state.
