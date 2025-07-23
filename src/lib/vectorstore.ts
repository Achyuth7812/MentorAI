function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8);
}

const DIM = 384; // all-MiniLM-L6-v2 embedding size
const vectors: number[][] = [];
export const chunks: string[] = [];

export function addChunk(embedding: number[], text: string) {
  vectors.push(embedding);
  chunks.push(text);
}

export function chunkCount(): number {
  return chunks.length;
}

export function queryChunks(queryEmb: number[], topK = 5): string[] {
  if (vectors.length === 0) return [];
  const scored = vectors.map((v, i) => ({
    score: cosineSimilarity(queryEmb, v),
    idx: i
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map(s => chunks[s.idx]);
}