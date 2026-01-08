
export class NeuralCache {
  private store: Map<string, { value: any, expires: number }> = new Map();

  set(key: string, value: any, ttlSeconds: number = 300) {
    this.store.set(key, {
      value,
      expires: Date.now() + (ttlSeconds * 1000)
    });
  }

  get(key: string): any | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  clear() {
    this.store.clear();
  }
}
