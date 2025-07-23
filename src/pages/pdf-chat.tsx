// pages/pdf-chat.tsx
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamic import of the client‑only PDFViewer
const PDFViewer = dynamic(() => import('@/components/ui/PDFViewer'), {
  ssr: false,
});

export default function PDFChatPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const form = new FormData();
    form.append('file', file);

    const { filePath } = await fetch('/api/pdf/upload', {
      method: 'POST',
      body: form,
    }).then((r) => r.json());

    await fetch('/api/pdf/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'upload', filePath }),
    });

    setFileUrl(filePath);
    setLoading(false);
  };

  const handleAsk = async () => {
    setLoading(true);
    const { answer } = await fetch('/api/pdf/qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'query', question }),
    }).then((r) => r.json());
    setAnswer(answer);
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>PDF Chat Assistant</title>
      </Head>
      <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
        <h1>PDF Chat Assistant</h1>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <button onClick={handleUpload} disabled={!file || loading} style={{ marginLeft: 8 }}>
            {loading ? 'Processing…' : 'Upload & Process'}
          </button>
        </div>

        {/* Only render the PDFViewer after upload */}
        {fileUrl && (
          <PDFViewer fileUrl={fileUrl} />
        )}

        {fileUrl && (
          <div style={{ marginTop: '1.5rem' }}>
            <textarea
              rows={3}
              style={{ width: '100%', marginBottom: '0.5rem' }}
              placeholder="Ask a question about the PDF…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleAsk} disabled={!question || loading}>
              {loading ? 'Thinking…' : 'Ask'}
            </button>
          </div>
        )}

        {answer && (
          <div style={{ marginTop: '1.5rem', background: '#f9f9f9', padding: '1rem' }}>
            <h2>Answer</h2>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </>
  );
}
