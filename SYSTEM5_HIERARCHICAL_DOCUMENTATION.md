# System 5 Hierarchical State Transition Model

## Overview

This model implements the highly complex, refined **System 5** structure based on the principles of **integer partitions**, **projective geometry analogues**, and **hierarchical nested concurrency**.

The system is composed of two main concurrent components:
1.  **4 Synchronous Sets (S1-S4)**: Operating on a 4-step cycle.
2.  **4 Tensor Bundles (T1-T4)**: Operating on a staggered 5-step cycle, each containing 3 concurrent threads (F1-F3).

The implementation utilizes **nested Taskflows** within the **CogTaskFlow** framework to accurately model the **concurrency-of-concurrency** and the hierarchical influence between the sets.

## Structure and Timing

### Synchronous Sets (S1, S2, S3, S4)

- **Structure**: Tetradic Simplex (4 elements).
- **Cycle**: 4 steps.
- **Pattern**: Sequential transition at every step.
    - S1 (U1), S2 (U2), S3 (U3) are Universal Sets.
    - S4 is the Particular Set, acting as the **global influence** on the Tensor Bundles.
- **State**: Integer states 0, 1, 2, 3, determined by $t \pmod 4$.

### Concurrent Tensor Bundles (T1, T2, T3, T4)

- **Structure**: 4 Triadic Simplices (Projective Planes), each a Tensor Bundle.
- **Inter-Bundle Concurrency (Level 1)**: Staggered 5-step cycle.
    - T1 transitions at $t \equiv 0 \pmod 5$
    - T2 transitions at $t \equiv 1 \pmod 5$
    - T3 transitions at $t \equiv 2 \pmod 5$
    - T4 transitions at $t \equiv 3 \pmod 5$
    - $t \equiv 4 \pmod 5$ is a rest step.
- **Intra-Bundle Concurrency (Level 2)**: 3 threads (F1, F2, F3) within each bundle operate concurrently.

## Nested Concurrency Logic (Hierarchical Convolution)

The transition of a thread $F_{i,j}$ (thread $j$ in bundle $i$) is a function of the other threads in its bundle and the state of the Synchronous Particular Set (S4).

### Transition Function

$$S_{i,j}(t+1) = (S_{i,j}(t) + \sum_{k \neq j} S_{i,k}(t) + S_{4}(t)) \pmod 4$$

This function models the **convolution** where the local state change is influenced by the local concurrent environment ($\sum S_{i,k}$) and the global synchronous environment ($S_4$).

### CogTaskFlow Implementation

- **Main Taskflow**: Manages the 4 Synchronous Sets and the 4 Tensor Bundles.
- **Sub-Taskflow (Bundle Step)**: Used for each active Tensor Bundle to manage the 3 concurrent threads and their dependencies. This is the key to modeling the **concurrency-of-concurrency**.

## Simulation Results

The simulation was run for **60 time steps** (the LCM of the 4-step and 5-step periodicities).

- **Synchronous Sets**: Show a clear, repeating 4-step cycle (0, 1, 2, 3).
- **Tensor Bundles**: The state history shows complex, non-trivial state changes in the threads, demonstrating that the nested concurrency and the influence of the S4 set are successfully modeled and interacting. The overall pattern is highly dynamic and only repeats after the full 60-step cycle.

## Deliverables

The following files are provided:

1.  **`SYSTEM5_HIERARCHICAL_DOCUMENTATION.md`**: This document, detailing the model and results.
2.  **`system5_hierarchical_nested.cpp`**: The C++ source code implementing the model using nested CogTaskFlows.
3.  **`visualize_system5_hierarchical.py`**: The Python script used to generate the timeline visualization.
4.  **`system5_hierarchical_timeline.png`**: The visual timeline of the state transitions.

This implementation provides a robust, executable model for the most complex System 5 structure you have described, accurately capturing the hierarchical and nested concurrency.
