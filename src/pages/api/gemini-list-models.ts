// This endpoint is deprecated. Perplexity API does not require model listing.
import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(410).json({ error: 'This endpoint is deprecated. Perplexity API does not require model listing.' });
} 