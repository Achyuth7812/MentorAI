'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import react-pdf components so they only load in the browser
const Document = dynamic(() => import('react-pdf').then((m) => m.Document), { ssr: false });
const Page     = dynamic(() => import('react-pdf').then((m) => m.Page),     { ssr: false });

export default function PDFChat() {
  const [file, setFile]       = useState<File | null>(null);
  const [filePath, setFilePath] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer]     = useState('');

  const uploadAndProcess = async () => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const { filePath } = await fetch('/api/pdf/upload', {
      method: 'POST',
      body: form,
    }).then((r) => r.json());
    console.log('Uploaded filePath:', filePath);

    const processRes = await fetch('/api/pdf/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'upload', filePath }),
    });
    const processData = await processRes.json();
    console.log('Process response:', processData);
    if (!processRes.ok) {
      alert('Failed to process PDF: ' + (processData?.message || processData?.error || 'Unknown error'));
      return;
    }
    setFilePath(filePath);
  };

  const askQuestion = async () => {
    const { answer } = await fetch('/api/pdf/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'query', question }),
    }).then((r) => r.json());
    setAnswer(answer);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>PDF Chat Assistant</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button onClick={uploadAndProcess} disabled={!file}>
        Upload & Process
      </button>

      {filePath && (
        <div style={{ marginTop: 20 }}>
          <Document file={filePath}>
            <Page pageNumber={1} />
          </Document>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the PDF..."
          rows={3}
          style={{ width: '100%' }}
        />
        <button onClick={askQuestion} disabled={!question}>
          Ask
        </button>
      </div>

      {answer && (
        <div style={{ marginTop: 20 }}>
          <h2>Answer:</h2>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
