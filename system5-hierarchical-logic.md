# System 5 Hierarchical Logic Formalization

## Structure

The refined System 5 model consists of two main components operating concurrently:

1.  **Synchronous Sets (S)**: 4 sets (3 Universal + 1 Particular)
2.  **Concurrent Tensor Bundles (T)**: 4 bundles, each containing 3 threads (12 threads total)

## Timing (Cycle Length: 60 steps)

### Synchronous Sets (S1, S2, S3, S4)

- **Pattern**: Sequential, one set transitions per step.
- **Cycle**: 4 steps.
- **Logic**:
    - S1 transitions at $t \equiv 0 \pmod 4$ (Universal 1)
    - S2 transitions at $t \equiv 1 \pmod 4$ (Universal 2)
    - S3 transitions at $t \equiv 2 \pmod 4$ (Universal 3)
    - S4 transitions at $t \equiv 3 \pmod 4$ (Particular)
- **State Labels**: S1-S4 (Integer states 0-3).

### Concurrent Tensor Bundles (T1, T2, T3, T4)

- **Inter-Bundle Concurrency (Level 1)**: Staggered, 5-step cycle.
    - T1 transitions at $t \equiv 0 \pmod 5$
    - T2 transitions at $t \equiv 1 \pmod 5$
    - T3 transitions at $t \equiv 2 \pmod 5$
    - T4 transitions at $t \equiv 3 \pmod 5$
    - $t \equiv 4 \pmod 5$ is a rest step.

- **Intra-Bundle Concurrency (Level 2)**: 3 threads (F1, F2, F3) within each bundle operate concurrently.

## Nested Concurrency (Hierarchical Convolution)

The transition of a thread $F_{i,j}$ (thread $j$ in bundle $i$) is influenced by the other threads in its bundle and the state of the Synchronous Sets.

### State Representation

- **Synchronous Sets**: Integer states 0-3.
- **Tensor Threads**: Integer states 0-3.

### Transition Function (Thread $F_{i,j}$)

The next state of thread $F_{i,j}$ is calculated as:

$$S_{i,j}(t+1) = (S_{i,j}(t) + \sum_{k \neq j} S_{i,k}(t) + S_{4}(t)) \pmod 4$$

Where:
- $S_{i,j}(t)$ is the current state of thread $j$ in bundle $i$.
- $\sum_{k \neq j} S_{i,k}(t)$ is the sum of the current states of the other two threads in the same bundle $i$.
- $S_{4}(t)$ is the current state of the Particular Set (S4) from the Synchronous group, acting as the **global influence** (the "Particular/Secondary-Universal" element).

### CogTaskFlow Implementation: Nested Taskflows

1.  **Main Taskflow (System Step)**:
    - **Synchronous Task**: Executes the 4-step cycle for S1-S4.
    - **Bundle Tasks (T1-T4)**: 4 parallel tasks, each running a sub-Taskflow.

2.  **Sub-Taskflow (Bundle Step)**:
    - **Read Tasks**: 3 parallel tasks to read the current state of F1, F2, F3.
    - **Transition Tasks**: 3 parallel tasks (F1-Trans, F2-Trans, F3-Trans).
        - Each $F_j$-Trans depends on the read tasks of $F_k$ ($k \neq j$).
        - Each $F_j$-Trans also reads the current state of $S_4$ (the global influence).
        - The transition function is applied.

This structure models the **concurrency-of-concurrency** and the **hierarchical influence** from the Synchronous Sets.
