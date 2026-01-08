
import { Neuron, NeuronType, AnalysisNeuron, MetaNeuron } from './neurons';
import { Synapse } from './synapses';

export class Network {
  id: string;
  neurons: Map<string, Neuron> = new Map();
  synapses: Map<string, Synapse> = new Map(); // Key: sourceId:targetId
  subNetworks: Map<string, Network> = new Map();

  constructor(id: string = 'root') {
    this.id = id;
  }

  addNeuron(neuron: Neuron) {
    this.neurons.set(neuron.id, neuron);
  }

  addSubNetwork(net: Network) {
    this.subNetworks.set(net.id, net);
  }

  getNeuron<T extends Neuron>(id: string): T | undefined {
    let n = this.neurons.get(id);
    if (!n) {
      for (const sub of this.subNetworks.values()) {
        n = sub.getNeuron(id);
        if (n) break;
      }
    }
    return n as T;
  }

  connect(sourceId: string, targetId: string, weight: number = Math.random() - 0.5) {
    const key = `${sourceId}:${targetId}`;
    if (!this.synapses.has(key)) {
      this.synapses.set(key, new Synapse(sourceId, targetId, weight));
    }
  }

  // NEAT-style dynamic innovation: add a neuron in the middle of a synapse
  splitSynapse(sourceId: string, targetId: string, newId: string) {
    const key = `${sourceId}:${targetId}`;
    const oldSynapse = this.synapses.get(key);
    if (oldSynapse) {
      this.synapses.delete(key);
      const newNeuron = new Neuron(newId, 0, NeuronType.CORE);
      this.addNeuron(newNeuron);
      this.connect(sourceId, newId, 1.0);
      this.connect(newId, targetId, oldSynapse.weight);
    }
  }

  propagate() {
    this.synapses.forEach(synapse => {
      const source = this.getNeuron(synapse.sourceId);
      const target = this.getNeuron(synapse.targetId);
      if (source && target) {
        const influence = source.activation * synapse.weight;
        target.activation = Math.tanh(target.activation + influence + target.bias);
        synapse.decay(0.0005); // Continuous synaptic decay
      }
    });

    // Update MetaNeurons
    this.neurons.forEach(n => {
      if (n instanceof MetaNeuron) {
        const others = Array.from(this.neurons.values()).filter(node => node.id !== n.id);
        n.updateFromNodes(others);
      }
    });

    this.subNetworks.forEach(sub => sub.propagate());
    this.pruneSynapses();
  }

  private pruneSynapses() {
    this.synapses.forEach((synapse, key) => {
      if (synapse.health < 0.1 && synapse.stability < 0.2) {
        this.synapses.delete(key);
      }
    });
  }

  injectAnalysis(neuronId: string, sentiment: number, confidence: number) {
    const neuron = this.getNeuron(neuronId);
    if (neuron instanceof AnalysisNeuron) {
      neuron.setSignal(sentiment, confidence);
    }
  }
}
