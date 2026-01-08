
type NeuralEventCallback = (data: any) => void;

export class NeuralBus {
  private listeners: Map<string, NeuralEventCallback[]> = new Map();

  subscribe(event: string, callback: NeuralEventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  publish(event: string, data: any) {
    this.listeners.get(event)?.forEach(cb => cb(data));
  }
}
