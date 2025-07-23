'use client';

import { useState, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';

// 1. Serve the worker from unpkg, which matches the installed pdfjs.version
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

interface PDFViewerProps {
  fileUrl: string;
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('PDFViewer fileUrl:', fileUrl);
  }, [fileUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(err: any) {
    console.error('Error loading PDF:', err);
    setError('Failed to load PDF. Please try again or re-upload.');
  }

  // Build absolute URL for the PDF file
  const absoluteUrl = 
    typeof window !== 'undefined' 
      ? `${window.location.origin}${fileUrl}` 
      : '';

  return (
    <div style={{
      border: '1px solid #ccc',
      padding: 16,
      width: '100%',
      maxWidth: 800,
      height: 600,
      overflow: 'auto',
      margin: '0 auto',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <Document
        file={{ url: fileUrl }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
      >
        {Array.from({ length: Math.min(numPages, 5) }, (_, i) => (
          <Page key={i} pageNumber={i + 1} width={750} />
        ))}
      </Document>
      {numPages > 5 && (
        <div style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
          Only the first 5 pages are shown for preview.
        </div>
      )}
    </div>
  );
}
