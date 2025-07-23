// src/lib/embeddings.ts
import { InferenceClient } from '@huggingface/inference';

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY!);

/**
 * Turn an input string into a semantic embedding
 * using the free all‑MiniLM‑L6‑v2 model.
 */
export async function embedText(text: string): Promise<number[]> {
  // featureExtraction returns a 2D array: [ [embedding values...] ]
  const result = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: text,
  });
  // TypeScript may see this as any; cast appropriately:
  const embeddings = result as number[][];
  return embeddings[0];
}
