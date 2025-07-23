import fs from 'fs';
import pdf from 'pdf-parse';

/**
 * Read a PDF from the public folder,
 * extract all text, then split into ~1000‑char chunks.
 */
export async function extractTextChunks(filePath: string): Promise<string[]> {
  // filePath comes back as "/uploads/123456.pdf"
  const fullPath = `./public${filePath}`;
  const dataBuffer = fs.readFileSync(fullPath);
  const { text } = await pdf(dataBuffer);

  // Break text into bite‑sized chunks
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += 1000) {
    chunks.push(text.slice(i, i + 1000));
  }
  return chunks;
}
