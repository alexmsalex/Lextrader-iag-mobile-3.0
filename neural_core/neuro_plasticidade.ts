
import { Network } from './networks';
import { Synapse } from './synapses';

export class NeuroPlasticityEngine {
  private reorganizationCount: number = 0;

  /**
   * Applies Hebbian learning principles: strengthens active pathways and prunes weak ones.
   */
  optimize(network: Network) {
    let pruned = 0;
    let reinforced = 0;

    network.synapses.forEach((synapse, key) => {
      // Hebbian Reinforcement: if both source and target are active, strengthen the connection
      const source = network.getNeuron(synapse.sourceId);
      const target = network.getNeuron(synapse.targetId);

      if (source && target) {
        if (Math.abs(source.activation) > 0.5 && Math.abs(target.activation) > 0.5) {
          synapse.adjust(0.05); // Strengthen
          reinforced++;
        }
      }

      // Pruning: remove synapses with low health and low weight
      if (synapse.health < 0.2 && Math.abs(synapse.weight) < 0.05) {
        network.synapses.delete(key);
        pruned++;
      }
    });

    // Potential for New Innovations (Dynamic Connections)
    if (Math.random() > 0.95) {
      this.forgeRandomConnection(network);
    }

    this.reorganizationCount++;
    return { pruned, reinforced, cycle: this.reorganizationCount };
  }

  private forgeRandomConnection(network: Network) {
    const neuronIds = Array.from(network.neurons.keys());
    if (neuronIds.length < 2) return;

    const source = neuronIds[Math.floor(Math.random() * neuronIds.length)];
    const target = neuronIds[Math.floor(Math.random() * neuronIds.length)];

    if (source !== target) {
      network.connect(source, target, (Math.random() - 0.5) * 0.1);
    }
  }
}
