
import { Neuron } from '../neural_core/neurons';

export class FileNeuronMapper {
  mapFileToNeuron(fileName: string, fileSize: number, content: string): Neuron {
    const id = `neuron_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}`;
    // Use file size as a bias and content hash as initial activation
    const bias = (fileSize % 1000) / 1000;
    const neuron = new Neuron(id, bias);
    neuron.activation = (content.length % 100) / 100;
    return neuron;
  }
}
