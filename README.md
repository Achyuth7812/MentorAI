# AI Study Assistant

A comprehensive AI-powered study assistant that helps students create personalized study plans based on their uploaded study materials, exam dates, and subjects.

## Features

### 📚 PDF Processing & RAG
- Upload and process PDF study materials
- Extract text content and create embeddings for intelligent search
- Retrieve relevant information using vector similarity search
- Phot for Reference <img width="1917" height="858" alt="Screenshot 2025-07-23 004528" src="https://github.com/user-attachments/assets/fd179dcf-da31-45d0-b25a-eaf701cb7104" />


### 📅 Exam Planning
- Input exam date and subject
- Calculate optimal study timeline
- Generate personalized study schedules
- Photo for Refernce
<img width="1255" height="845" alt="Screenshot 2025-07-23 003244" src="https://github.com/user-attachments/assets/d396ae52-ed34-4d58-9788-ad1b51bece11" />
<img width="1258" height="882" alt="Screenshot 2025-07-23 003255" src="https://github.com/user-attachments/assets/22122971-eb54-4d04-911b-2e0e68e167eb" />


### 🎯 Study Plan Generation
- **Key Topics**: AI identifies and prioritizes main topics from your materials
- **Daily Schedule**: Creates detailed daily study plans with:
  - Specific topics to cover each day
  - Time allocation recommendations
  - Focus areas for each session
- **Weekly Goals**: Sets measurable, achievable goals
- **Exam Strategy**: Provides strategic tips for exam preparation and performance

### 💬 Interactive Study Chat
- Ask questions about your uploaded study materials
- Get instant answers based on the PDF content
- Real-time conversation with your study assistant

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI/ML**: OpenAI GPT-4, Hugging Face inference
- **Vector Database**: FAISS for similarity search
- **PDF Processing**: pdf-parse, react-pdf
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- OpenAI API key
- Hugging Face API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mentor-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
OPENAI_API_KEY=your_openai_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Step 1: Upload Study Material
1. Click "Upload PDF" to select your study material
2. The system will process and extract content from your PDF
3. Content is embedded and stored for intelligent search

### Step 2: Enter Exam Details
1. Select your exam date (must be in the future)
2. Enter the subject name (e.g., Mathematics, Physics, History)
3. Start chatting with your study material while you wait

### Step 3: Get Your Study Plan
1. Click "Generate Study Plan" to create a personalized plan
2. Review your key topics, daily schedule, weekly goals, and exam strategy
3. Continue chatting with your study assistant for clarification

## API Endpoints

### `/api/pdf/upload`
Upload and process PDF files for study plan generation.

### `/api/pdf/qa`
Query the uploaded PDF content using RAG (Retrieval-Augmented Generation).

### `/api/study-plan/generate`
Generate personalized study plans based on uploaded content, exam date, and subject.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main study assistant interface
│   └── layout.tsx         # Root layout
├── components/ui/          # UI components
│   ├── StudyChat.tsx      # Interactive chat component
│   ├── PDFViewer.tsx      # PDF display component
│   └── button.tsx         # Button component
├── lib/                   # Utility libraries
│   ├── embeddings.ts      # Text embedding functions
│   ├── pdf.ts            # PDF processing utilities
│   └── vectorstore.ts     # Vector database operations
└── pages/api/             # API routes
    ├── pdf/               # PDF-related endpoints
    └── study-plan/        # Study plan generation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
