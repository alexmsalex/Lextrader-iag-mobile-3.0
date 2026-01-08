
export interface NeuralEpisode {
  timestamp: number;
  marketSentiment: number;
  patternDetected: string;
  totalPnL: number;
  activations: Record<string, number>;
  significance: number; // 0-1, how important this memory is
}

export class MemoryFabric {
  private episodes: NeuralEpisode[] = [];
  private maxEpisodes: number = 50;

  addEpisode(episode: NeuralEpisode) {
    // Only keep significant episodes or latest ones
    this.episodes.push(episode);
    this.episodes.sort((a, b) => b.significance - a.significance);
    
    if (this.episodes.length > this.maxEpisodes) {
      this.episodes = this.episodes.slice(0, this.maxEpisodes);
    }
  }

  getRecentEpisodes(count: number = 5): NeuralEpisode[] {
    return [...this.episodes].sort((a, b) => b.timestamp - a.timestamp).slice(0, count);
  }

  getMostSignificant(): NeuralEpisode | null {
    return this.episodes.length > 0 ? this.episodes[0] : null;
  }

  // Find a memory similar to current state
  recall(currentSentiment: number, currentPattern: string): NeuralEpisode | null {
    if (this.episodes.length === 0) return null;

    return this.episodes.reduce((prev, curr) => {
      const prevDiff = Math.abs(prev.marketSentiment - currentSentiment);
      const currDiff = Math.abs(curr.marketSentiment - currentSentiment);
      
      const patternMatchBonus = curr.patternDetected === currentPattern ? 0.2 : 0;
      const prevMatchBonus = prev.patternDetected === currentPattern ? 0.2 : 0;

      return (currDiff - patternMatchBonus) < (prevDiff - prevMatchBonus) ? curr : prev;
    });
  }

  serialize() {
    return JSON.stringify(this.episodes);
  }

  deserialize(json: string) {
    try {
      this.episodes = JSON.parse(json);
    } catch (e) {
      this.episodes = [];
    }
  }
}
