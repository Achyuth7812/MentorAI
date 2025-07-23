import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full flex flex-col items-center">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-4 mb-4 shadow-lg">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#18181B" />
              <path d="M24 12L32 36H16L24 12Z" fill="#6366F1" />
              <circle cx="24" cy="28" r="4" fill="#A5B4FC" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">MentorAI</h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium text-center max-w-md">
            Your AI-powered study companion. Smarter plans, focused sessions, and real motivation—every day.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 w-full">
          <div className="bg-gray-800/80 rounded-xl p-5 flex flex-col items-center shadow-md">
            <span className="text-blue-400 text-2xl mb-2">📚</span>
            <h3 className="font-semibold text-lg mb-1">Personalized Study Plans</h3>
            <p className="text-gray-400 text-sm text-center">Upload your materials and get a custom AI-powered plan for your exams.</p>
          </div>
          <div className="bg-gray-800/80 rounded-xl p-5 flex flex-col items-center shadow-md">
            <span className="text-purple-400 text-2xl mb-2">💬</span>
            <h3 className="font-semibold text-lg mb-1">Chat with Your PDFs</h3>
            <p className="text-gray-400 text-sm text-center">Ask questions and get instant answers from your study documents.</p>
          </div>
          <div className="bg-gray-800/80 rounded-xl p-5 flex flex-col items-center shadow-md">
            <span className="text-green-400 text-2xl mb-2">⏰</span>
            <h3 className="font-semibold text-lg mb-1">Focus & Study Sessions</h3>
            <p className="text-gray-400 text-sm text-center">Start a focus timer, track your streaks, and earn coins for every session.</p>
          </div>
          <div className="bg-gray-800/80 rounded-xl p-5 flex flex-col items-center shadow-md">
            <span className="text-yellow-400 text-2xl mb-2">🏆</span>
            <h3 className="font-semibold text-lg mb-1">Motivation & Rewards</h3>
            <p className="text-gray-400 text-sm text-center">Stay motivated with coins, streaks, and progress stats. Level up your learning!</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <Link href="/auth/signin" className="w-full md:w-auto">
            <button className="w-full md:w-auto px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-lg shadow transition">
              Sign In
            </button>
          </Link>
          <Link href="/auth/signup" className="w-full md:w-auto">
            <button className="w-full md:w-auto px-8 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold text-lg shadow border border-gray-500 transition">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-xs text-center">
          &copy; {new Date().getFullYear()} MentorAI. All rights reserved.
        </div>
      </div>
    </main>
  );
}