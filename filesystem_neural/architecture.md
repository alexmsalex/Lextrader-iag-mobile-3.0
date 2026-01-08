# Architecture Overview: Lextrader-IAG Quantum

## Core Components

### 1. Evolution Engine (`evolution/`)
Manages the genetic optimization of neural weights. It uses a DNA-based approach to crossover and mutate network configurations, selecting the best performers for market prediction tasks.

### 2. Quantum Layer (`quantum/`)
Simulates quantum states (superposition and entanglement) to provide a non-deterministic entropy source for neural activations. This introduces "quantum intuition" into the decision-making process.

### 3. Oracle System (`oracle/`)
Aggregates real-time market data from multiple sources. It utilizes Google Gemini (LLM) to perform deep sentiment analysis, which is then fused with technical signals via a consensus engine.

### 4. Neural Core (`neural_core/`)
The fundamental implementation of the synthetic brain. It consists of layers of neurons and synapses that process inputs from the filesystem and market oracle.

### 5. Filesystem Mapping (`filesystem_neural/`)
A unique feature that treats the local project structure as a biological system. File sizes, types, and contents are mapped to specific neural biases and initial activation states.
