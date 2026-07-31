# System 4 State Transition Matrix Implementation

## Overview

This implementation models **System 4** state transitions using the **CogTaskFlow** parallel programming framework. System 4 consists of two types of state sets operating with distinct synchronization patterns:

- **2 Synchronous Universal Sets**: Alternate double-step transitions
- **3 Concurrent Particular Sets**: Independent transitions 4 steps apart

The implementation leverages CogTaskFlow's cognitive tensor architecture and parallel task execution capabilities to efficiently model and simulate these complex state transition patterns.

---

## Architecture

### System Components

#### 1. Universal Sets (U1 and U2)

**Characteristics**:
- **State Space**: 5 states per set {S0, S1, S2, S3, S4}
- **Synchronization**: Synchronous alternation
- **Transition Pattern**: Alternate double steps
- **Cognitive Representation**: 5-dimensional cognitive tensors with one-hot encoding

**Transition Schedule**:
```
Time:  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
U1:    X  X  -  -  X  X  -  -  X  X  -  -  X  X  -  -
U2:    -  -  X  X  -  -  X  X  -  -  X  X  -  -  X  X
```

**Pattern Logic**:
- U1 transitions at time steps where `t % 4 ∈ {0, 1}` (double step)
- U2 transitions at time steps where `t % 4 ∈ {2, 3}` (double step)
- The sets alternate every 2 time steps, ensuring synchronous coordination

**Transition Matrix** (5×5):
```
         S0    S1    S2    S3    S4
    S0 [ 0.10  0.40  0.30  0.10  0.10 ]
    S1 [ 0.20  0.20  0.30  0.20  0.10 ]
    S2 [ 0.10  0.20  0.20  0.30  0.20 ]
    S3 [ 0.10  0.10  0.20  0.30  0.30 ]
    S4 [ 0.20  0.10  0.10  0.20  0.40 ]
```

Each row represents transition probabilities from a given state to all possible next states. The matrix is row-stochastic (each row sums to 1.0).

#### 2. Particular Sets (P1, P2, and P3)

**Characteristics**:
- **State Space**: 4 states per set {S0, S1, S2, S3}
- **Synchronization**: Concurrent (independent)
- **Transition Pattern**: 4 steps apart with 1-step offset
- **Cognitive Representation**: 4-dimensional cognitive tensors with one-hot encoding

**Transition Schedule**:
```
Time:  0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
P1:    X  -  -  -  X  -  -  -  X  -  -  -  X  -  -  -
P2:    -  X  -  -  -  X  -  -  -  X  -  -  -  X  -  -
P3:    -  -  X  -  -  -  X  -  -  -  X  -  -  -  X  -
```

**Pattern Logic**:
- P1 transitions at time steps where `t % 4 = 0`
- P2 transitions at time steps where `t % 4 = 1`
- P3 transitions at time steps where `t % 4 = 2`
- Each set operates independently on a 4-step cycle

**Transition Matrix** (4×4):
```
         S0    S1    S2    S3
    S0 [ 0.30  0.40  0.20  0.10 ]
    S1 [ 0.20  0.30  0.30  0.20 ]
    S2 [ 0.10  0.20  0.40  0.30 ]
    S3 [ 0.20  0.20  0.20  0.40 ]
```

---

## Implementation Details

### Core Classes

#### `TransitionMatrix`

Manages state transition probabilities with the following capabilities:

**Methods**:
- `set(from, to, prob)`: Set transition probability from one state to another
- `get(from, to)`: Retrieve transition probability
- `normalize()`: Ensure all rows sum to 1.0 (probability conservation)
- `print(name)`: Display matrix in formatted output

**Features**:
- Automatic probability normalization
- Efficient matrix storage using nested vectors
- Support for arbitrary state space sizes

#### `UniversalSet`

Represents a universal set with 5-state space.

**Attributes**:
- `name`: Identifier (U1 or U2)
- `current_state`: Current state index (0-4)
- `transition_matrix`: 5×5 transition probability matrix
- `state_history`: Vector tracking state evolution over time
- `state_tensor`: Cognitive tensor for neural representation

**Methods**:
- `initialize_transition_matrix()`: Set up transition probabilities
- `update_state_tensor()`: Update one-hot encoded state representation
- `transition(rng)`: Perform probabilistic state transition using RNG

**Cognitive Tensor Integration**:
- Each state is represented as a 5-dimensional cognitive tensor
- One-hot encoding: current state = 1.0, all others = 0.0
- Enables integration with cognitive processing frameworks

#### `ParticularSet`

Represents a particular set with 4-state space.

**Attributes**:
- `name`: Identifier (P1, P2, or P3)
- `current_state`: Current state index (0-3)
- `transition_matrix`: 4×4 transition probability matrix
- `state_history`: Vector tracking state evolution over time
- `state_tensor`: Cognitive tensor for neural representation

**Methods**:
- Similar to UniversalSet but adapted for 4-state space
- Independent transition logic without synchronization constraints

#### `System4StateMachine`

Orchestrates the complete System 4 simulation.

**Attributes**:
- `u1`, `u2`: Two universal set instances
- `p1`, `p2`, `p3`: Three particular set instances
- `rng`: Random number generator for stochastic transitions
- `current_time`: Simulation time counter

**Methods**:
- `step(taskflow)`: Execute one time step with parallel transitions
- `should_universal_1_step(t)`: Check if U1 should transition at time t
- `should_universal_2_step(t)`: Check if U2 should transition at time t
- `should_particular_1_step(t)`: Check if P1 should transition at time t
- `should_particular_2_step(t)`: Check if P2 should transition at time t
- `should_particular_3_step(t)`: Check if P3 should transition at time t
- `print_current_state()`: Display current state of all sets
- `print_transition_schedule(max_time)`: Visualize transition timing
- `print_state_history()`: Display complete state evolution

**Parallel Execution**:
The `step()` method creates parallel tasks in the CogTaskFlow framework for concurrent state transitions. At each time step:
1. Determine which sets should transition based on timing rules
2. Create parallel tasks for each active set
3. Execute tasks concurrently using TaskFlow executor
4. Update state histories

---

## CogTaskFlow Integration

### Cognitive Tensor Representation

Each state set maintains a **cognitive tensor** that represents its current state:

**Universal Sets**: 5-dimensional float tensors
```cpp
auto state_tensor = std::make_shared<tf::FloatCognitiveTensor>(
    tf::CognitiveTensorShape{NUM_UNIVERSAL_STATES}, 0.0f);
```

**Particular Sets**: 4-dimensional float tensors
```cpp
auto state_tensor = std::make_shared<tf::FloatCognitiveTensor>(
    tf::CognitiveTensorShape{NUM_PARTICULAR_STATES}, 0.0f);
```

**One-Hot Encoding**:
- Current state position = 1.0
- All other positions = 0.0
- Example: State S2 in 5-state space → [0.0, 0.0, 1.0, 0.0, 0.0]

### Parallel Task Execution

The implementation uses CogTaskFlow's task graph capabilities:

```cpp
tf::Taskflow taskflow;
tf::Executor executor;

// Create parallel transition tasks
auto u1_task = taskflow.emplace([this]() { u1.transition(rng); }).name("U1_transition");
auto p1_task = taskflow.emplace([this]() { p1.transition(rng); }).name("P1_transition");

// Execute tasks in parallel
executor.run(taskflow).wait();
```

**Benefits**:
- **Concurrency**: Particular sets can transition simultaneously
- **Efficiency**: Work-stealing scheduler optimizes CPU utilization
- **Scalability**: Easy to extend to more sets or complex dependencies
- **Profiling**: Built-in support for performance analysis

---

## Transition Patterns

### Universal Set Synchronization

The universal sets implement a **strict alternation pattern** to ensure synchronous coordination:

**4-Step Cycle**:
```
Step 0: U1 transitions (first of double step)
Step 1: U1 transitions (second of double step)
Step 2: U2 transitions (first of double step)
Step 3: U2 transitions (second of double step)
[Cycle repeats]
```

**Synchronization Constraint**:
- When U1 is active, U2 must be inactive
- When U2 is active, U1 must be inactive
- No overlap in transition windows
- Deterministic scheduling based on modulo arithmetic

**Implementation**:
```cpp
bool should_universal_1_step(int t) const {
    int cycle_pos = t % 4;
    return (cycle_pos == 0 || cycle_pos == 1);
}

bool should_universal_2_step(int t) const {
    int cycle_pos = t % 4;
    return (cycle_pos == 2 || cycle_pos == 3);
}
```

### Particular Set Concurrency

The particular sets operate **independently** with staggered timing:

**4-Step Cycle with Offset**:
```
P1: Transitions at t = 0, 4, 8, 12, 16... (offset 0)
P2: Transitions at t = 1, 5, 9, 13, 17... (offset 1)
P3: Transitions at t = 2, 6, 10, 14, 18... (offset 2)
```

**Concurrency Characteristics**:
- No synchronization required between particular sets
- Each set maintains independent state evolution
- Staggered pattern ensures distributed computational load
- Can execute in parallel when scheduled at same time step

**Implementation**:
```cpp
bool should_particular_1_step(int t) const { return (t % 4 == 0); }
bool should_particular_2_step(int t) const { return (t % 4 == 1); }
bool should_particular_3_step(int t) const { return (t % 4 == 2); }
```

---

## State Space Analysis

### Combined System State

At any time t, the complete system state is a 5-tuple:

**State(t) = (U1(t), U2(t), P1(t), P2(t), P3(t))**

**Total State Space Size**: 5 × 5 × 4 × 4 × 4 = **2,000 possible states**

### State Distribution

After running the simulation for 24 time steps, the implementation tracks:

**Universal Sets**:
- Number of transitions per state
- State occupation percentages
- Transition frequency analysis

**Particular Sets**:
- Independent state distributions
- Offset effects on state coverage
- Convergence to steady-state distribution

### Markov Chain Properties

Both universal and particular sets implement **discrete-time Markov chains**:

**Properties**:
- **Memoryless**: Next state depends only on current state
- **Stochastic**: Transitions are probabilistic
- **Homogeneous**: Transition probabilities don't change over time
- **Ergodic**: All states are reachable from any starting state

**Long-term Behavior**:
- Systems converge to steady-state distributions
- Steady-state can be computed from eigenvectors of transition matrices
- Actual distribution depends on initial conditions and number of steps

---

## Building and Running

### Prerequisites

- **C++ Compiler**: g++ with C++20 support
- **CMake**: Version 3.15 or higher
- **CogTaskFlow**: Cloned repository
- **pthreads**: For parallel execution

### Build Instructions

```bash
# Clone CogTaskFlow repository
git clone https://github.com/cogpy/cogtaskflow.git

# Create build directory
mkdir build && cd build

# Configure with CMake
cmake ..

# Compile
make

# Run simulation
./system4_state_transitions
```

### Expected Output

The simulation produces:

1. **Transition Matrices**: Display of probability matrices for both set types
2. **Transition Schedule**: Visual timeline showing when each set transitions
3. **State Evolution**: Real-time display of state changes at each time step
4. **State History**: Complete table of state evolution over time
5. **Distribution Analysis**: Statistical breakdown of state occupancy

---

## Visualization

### Python Visualization Script

The included `visualize_system4.py` generates three visualizations:

#### 1. Transition Schedule
Shows when each set is active over time with color-coded blocks.

#### 2. Transition Matrices
Heatmaps displaying transition probabilities for both universal and particular sets.

#### 3. Synchronization Pattern
Illustrates the alternating pattern of universal sets vs. concurrent particular sets.

### Running Visualization

```bash
# Install matplotlib
pip3 install matplotlib

# Generate visualizations
python3 visualize_system4.py
```

**Output Files**:
- `system4_transition_schedule.png`
- `system4_transition_matrices.png`
- `system4_synchronization_pattern.png`

---

## Mathematical Foundation

### Transition Probability

For a state set with transition matrix **P**, the probability of transitioning from state i to state j is:

**P(X(t+1) = j | X(t) = i) = P[i,j]**

### State Evolution

The state probability distribution evolves according to:

**π(t+1) = π(t) · P**

Where:
- **π(t)** is the state probability vector at time t
- **P** is the transition matrix

### Steady-State Distribution

The steady-state distribution **π*** satisfies:

**π* = π* · P**

This is the left eigenvector of **P** corresponding to eigenvalue 1.

### Multi-Set Dynamics

For System 4 with independent particular sets and synchronized universal sets:

**P_system(t) = P_U1(t) ⊗ P_U2(t) ⊗ P_P1(t) ⊗ P_P2(t) ⊗ P_P3(t)**

Where ⊗ represents the tensor product of state distributions.

---

## Applications

### Cognitive Modeling

System 4 can model cognitive processes with:
- **Universal Sets**: High-level executive control states
- **Particular Sets**: Parallel sensory or motor processing streams

### Neural Network States

The state transition matrices can represent:
- **Attractor Dynamics**: Convergence to stable states
- **Mode Switching**: Transitions between processing modes
- **Hierarchical Processing**: Different timescales for different levels

### Distributed Systems

The synchronization patterns apply to:
- **Coordinated Services**: Universal sets as synchronized components
- **Independent Workers**: Particular sets as parallel processors
- **Load Balancing**: Staggered timing reduces contention

### Biological Systems

Analogies to biological processes:
- **Neural Oscillations**: Synchronized universal sets as coupled oscillators
- **Parallel Pathways**: Particular sets as independent neural streams
- **Homeostatic Regulation**: State transitions maintaining system balance

---

## Extensions and Future Work

### Possible Enhancements

1. **Adaptive Transition Matrices**: Learning-based probability updates
2. **Continuous-Time Dynamics**: Differential equation-based transitions
3. **Hierarchical State Spaces**: Multi-level state organization
4. **Attention Mechanisms**: Cognitive tensor attention weighting
5. **Pattern Recognition**: Detecting recurring state sequences
6. **Optimization**: Finding optimal transition matrices for target behaviors

### Integration Opportunities

- **OpenCog AtomSpace**: Knowledge graph representation of states
- **Neural Networks**: State tensors as neural network inputs
- **Reinforcement Learning**: State transitions as MDP for RL
- **Visualization Tools**: Interactive state space exploration

---

## References

### CogTaskFlow

- **Repository**: https://github.com/cogpy/cogtaskflow
- **Base Framework**: TaskFlow (https://taskflow.github.io)
- **Cognitive Extensions**: OpenCog-inspired cognitive tensor architecture

### Theoretical Background

- **Markov Chains**: Discrete-time stochastic processes
- **Cognitive Architectures**: Multi-level information processing models
- **Parallel Computing**: Task-based parallelism and work-stealing schedulers
- **State Space Models**: Probabilistic state transition systems

---

## License

This implementation follows the licensing of the CogTaskFlow repository (MIT License).

---

## Contact and Contributions

For questions, issues, or contributions related to System 4 implementation, please refer to the CogTaskFlow repository or the Cosmos System 5 project.

---

*Last Updated: November 24, 2025*
