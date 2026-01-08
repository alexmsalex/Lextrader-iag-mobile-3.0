
export class StateSerializer {
  static serialize(obj: any): string {
    return JSON.stringify(obj);
  }

  static deserialize<T>(json: string): T {
    return JSON.parse(json) as T;
  }

  static async saveToStorage(key: string, data: any) {
    localStorage.setItem(key, this.serialize(data));
  }

  static async loadFromStorage<T>(key: string): Promise<T | null> {
    const data = localStorage.getItem(key);
    return data ? this.deserialize<T>(data) : null;
  }
}
