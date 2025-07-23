// src/pages/api/pdf/qa.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { extractTextChunks } from '@/lib/pdf';
import { embedText } from '@/lib/embeddings';
import { addChunk, queryChunks } from '@/lib/vectorstore';
import * as vectorstore from '@/lib/vectorstore';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY!;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

let pdfUploaded = false; // Track if a PDF is uploaded for demo

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { mode, filePath, question } = req.body;

  try {
    if (mode === 'upload') {
      console.log('Processing PDF filePath:', filePath);
      const chunks = await extractTextChunks(filePath);
      console.log('Number of chunks created:', chunks.length);
      if (chunks.length === 0) {
        console.warn('No chunks created from PDF. The PDF may be empty or unreadable.');
        return res.status(400).json({ error: 'No text could be extracted from the PDF. Please try a different file.' });
      }
      // Embed and store each chunk in the vectorstore
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const emb = await embedText(chunk);
        if (i === 0) {
          console.log('First chunk:', chunk.slice(0, 200));
          console.log('First chunk embedding:', emb.slice(0, 10), '... length:', emb.length);
        }
        addChunk(emb, chunk);
      }
      pdfUploaded = true;
      console.log('PDF processed and indexed successfully');
      return res.status(200).json({ message: 'PDF processed and indexed successfully' });
    }

    if (mode === 'query') {
      console.log('Querying PDF with question:', question);
      if (!pdfUploaded) {
        return res.status(200).json({
          answer: "Please upload and process a PDF before asking questions."
        });
      }
      // Embed the question
      const queryEmb = await embedText(question);
      console.log('Question embedding:', queryEmb.slice(0, 10), '... length:', queryEmb.length);
      // Retrieve top 5 relevant chunks
      const topChunks = queryChunks(queryEmb, 5);
      console.log('queryChunks returned:', topChunks);
      let context = topChunks.join('\n\n');
      if (!topChunks || topChunks.length === 0) {
        console.warn('No relevant PDF chunks found for the question. Using first 3 chunks as fallback.');
        // Fallback: use the first 3 chunks if available
        if (Array.isArray(vectorstore.chunks) && vectorstore.chunks.length > 0) {
          context = vectorstore.chunks.slice(0, 3).join('\n\n');
        } else {
          return res.status(200).json({ answer: "Sorry, I couldn't find relevant information in your PDF for this question. Try re-uploading or asking a different question." });
        }
      }
      console.log('Context sent to model:', context);
      const prompt = `
You are a helpful study assistant. ONLY use the following PDF excerpts to answer the user's question. If the answer is not in the context, say you don't know. Quote or summarize from the PDF excerpts if possible.

PDF Excerpts:\n${context}\n\nQuestion: ${question}\nAnswer:`;
      try {
        const perplexityRes = await fetch(PERPLEXITY_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'sonar',
            messages: [
              { role: 'system', content: 'You are a helpful study assistant.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 1024,
          }),
        });
        const perplexityData = await perplexityRes.json();
        const answer = perplexityData.choices?.[0]?.message?.content || '';
        return res.status(200).json({ answer });
      } catch (err) {
        return res.status(200).json({
          answer: "Sorry, I couldn't process your question right now. Please try again later."
        });
      }
    }

    return res.status(400).json({ error: 'Invalid mode specified' });
  } catch (err: any) {
    return res.status(200).json({
      answer: "Sorry, I couldn't process your question right now. Please try again later."
    });
  }
}
