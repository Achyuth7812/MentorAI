import { createRouter } from 'next-connect';
import multer from 'multer';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

// Extend the NextApiRequest type to include the file property from multer
interface NextApiRequestWithFile extends NextApiRequest {
  file?: Express.Multer.File;
}

// Configure multer for file storage
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `file-${Date.now()}${ext}`;
      cb(null, uniqueName);
    },
  }),
});

const router = createRouter<NextApiRequestWithFile, NextApiResponse>();

// Apply the multer middleware, casting to 'any' to resolve the type mismatch
router.use(upload.single('file') as any);

// Define the POST handler
router.post((req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  res.status(200).json({ message: 'File uploaded successfully!', filePath: `/uploads/${req.file.filename}` });
});

// Disable the default Next.js body parser so multer can work correctly
export const config = {
  api: {
    bodyParser: false,
  },
};

// Export the router's handler with error handling
export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});