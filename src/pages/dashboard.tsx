import dynamic from 'next/dynamic';
import { useState, useRef } from 'react';
import StudyChat from '@/components/ui/StudyChat';
import { Sun, Moon, Bell, BellOff, UserCircle, ChevronDown, Calendar, BookOpen, ChevronUp } from 'lucide-react';

const PDFChat = dynamic(() => import('@/components/ui/PDFChat'), { ssr: false });

const FOCUS_MINUTES = 25;
const BREAK_MINUTES = 5;

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

// Add for progress ring
function getProgress(percent: number) {
  const r = 54; // radius
  const c = 2 * Math.PI * r;
  return {
    strokeDasharray: c,
    strokeDashoffset: c * (1 - percent),
  };
}

// Mock user data (replace with real user data from session in production)
const mockUser = {
  name: 'Achyuth',
  email: 'achyuth@example.com',
};

export default function Dashboard() {
  // Focus Timer State
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [numBreaks, setNumBreaks] = useState(1);
  const [breaksLeft, setBreaksLeft] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [dark, setDark] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Study Plan State
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');

  // Daily focus tracking
  const [focusTarget, setFocusTarget] = useState(5); // hours
  const [focusCompleted, setFocusCompleted] = useState(0); // minutes

  // Update timer when settings change
  const updateTimerSettings = (focus: number, brk: number, n: number) => {
    setFocusMinutes(focus);
    setBreakMinutes(brk);
    setNumBreaks(n);
    setBreaksLeft(n);
    setMode('focus');
    setSecondsLeft(focus * 60);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Focus Timer Logic
  const start = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s > 0) return s - 1;
          clearInterval(intervalRef.current!);
          setRunning(false);
          if (mode === 'focus' && breaksLeft > 0) {
            handleSessionEnd();
            setMode('break');
            setSecondsLeft(breakMinutes * 60);
          } else if (mode === 'break' && breaksLeft > 1) {
            setMode('focus');
            setBreaksLeft((b) => b - 1);
            setSecondsLeft(focusMinutes * 60);
          } else {
            if (mode === 'focus') handleSessionEnd();
            setMode('focus');
            setBreaksLeft(numBreaks);
            setSecondsLeft(focusMinutes * 60);
          }
          return 0;
        });
      }, 1000);
    }
  };

  const pause = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode('focus');
    setBreaksLeft(numBreaks);
    setSecondsLeft(focusMinutes * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  // Toggle dark/light mode
  const toggleDark = () => {
    setDark((d) => !d);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  // Toggle profile dropdown
  const toggleProfile = () => setProfileOpen((open) => !open);

  // Study Plan Generation
  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlan(null);
    setPlanError('');
    setPlanLoading(true);
    try {
      const res = await fetch('/api/study-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, examDate }),
      });
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      setPlanError('Failed to generate study plan.');
    } finally {
      setPlanLoading(false);
    }
  };

  // Track completed focus sessions
  const handleSessionEnd = () => {
    setFocusCompleted((prev) => prev + focusMinutes);
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-gradient-to-br from-[#181c2b] via-[#23243a] to-[#2d2255]' : 'bg-gradient-to-br from-[#e0e7ff] via-[#f0f4ff] to-[#c7d2fe]'}`}
    >
      {/* Header */}
      <header className="w-full flex items-center justify-between py-6 px-4 md:px-12 mb-6 relative">
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>Welcome to MentorAI</h1>
          <p className={`mt-1 text-base ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Your all-in-one study platform</p>
        </div>
        <div className="flex items-center gap-4 relative">
          <button onClick={toggleDark} className="p-2 rounded-full border border-transparent hover:border-blue-400 transition bg-white/10">
            {dark ? <Sun className="w-6 h-6 text-yellow-300" /> : <Moon className="w-6 h-6 text-blue-700" />}
          </button>
          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 cursor-pointer group relative" onClick={toggleProfile}>
            <UserCircle className={`w-9 h-9 ${dark ? 'text-blue-300' : 'text-blue-700'} group-hover:text-blue-500 transition`} />
            <span className={`font-semibold ${dark ? 'text-white' : 'text-blue-900'} hidden md:inline`}>{mockUser.name}</span>
            <ChevronDown className={`w-5 h-5 ${dark ? 'text-white' : 'text-blue-900'} transition`} />
            {/* Profile Dropdown */}
            {profileOpen && (
              <div className={`absolute right-0 top-12 z-50 min-w-[200px] rounded-xl shadow-xl p-4 ${dark ? 'bg-[#23243a] border border-blue-900 text-white' : 'bg-white border border-blue-200 text-blue-900'}`}
                style={{ boxShadow: '0 4px 32px 0 rgba(37,99,235,0.10)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <UserCircle className={`w-8 h-8 ${dark ? 'text-blue-300' : 'text-blue-700'}`} />
                  <div>
                    <div className="font-bold text-lg">{mockUser.name}</div>
                    <div className="text-xs opacity-80">{mockUser.email}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">Profile features coming soon…</div>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Main Content Grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: PDF Upload, Study Plan, Chat */}
        <div className="md:col-span-2 flex flex-col gap-8">
          <section className={`rounded-2xl shadow-xl p-6 border-2 ${dark ? 'bg-white/90 border-blue-100' : 'bg-white border-blue-200'}`}
            style={{ boxShadow: '0 4px 32px 0 rgba(37,99,235,0.10)' }}>
            <h2 className={`text-2xl font-bold mb-4 text-blue-900`}>PDF Upload & Chat</h2>
            <div className="text-gray-800">
              <PDFChat />
            </div>
          </section>
          {/* Study Plan Generator */}
          <section className={`rounded-2xl shadow-xl p-6 border-2 ${dark ? 'bg-white/90 border-green-100' : 'bg-white border-green-200'}`}
            style={{ boxShadow: '0 4px 32px 0 rgba(16,185,129,0.10)' }}>
            <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-2"><BookOpen className="w-6 h-6" /> Generate Study Plan</h2>
            <form onSubmit={handleGeneratePlan} className="flex flex-col md:flex-row gap-4 mb-4">
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Subject (e.g. Math, Physics)"
                className="flex-1 px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-400" />
                <input
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-bold shadow-lg hover:from-green-700 hover:to-green-500 transition"
                disabled={planLoading}
              >
                {planLoading ? 'Generating...' : 'Generate'}
              </button>
            </form>
            {planError && <div className="text-red-500 font-semibold mb-2">{planError}</div>}
            {plan && (
              <div className="bg-green-50 rounded-lg p-4 mt-2 overflow-x-auto">
                <h3 className="text-lg font-bold text-green-700 mb-2">Key Topics</h3>
                <ul className="list-disc list-inside mb-4">
                  {plan.keyTopics?.map((topic: string, i: number) => <li key={i}>{topic}</li>)}
                </ul>
                <h3 className="text-lg font-bold text-green-700 mb-2">Daily Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm mb-4">
                    <thead>
                      <tr className="bg-green-100">
                        <th className="px-2 py-1">Day</th>
                        <th className="px-2 py-1">Topics</th>
                        <th className="px-2 py-1">Time</th>
                        <th className="px-2 py-1">Focus Areas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.dailySchedule?.map((d: any, i: number) => (
                        <tr key={i} className="even:bg-green-50">
                          <td className="px-2 py-1 font-semibold">{d.day}</td>
                          <td className="px-2 py-1">{d.topics?.join(', ')}</td>
                          <td className="px-2 py-1">{d.timeAllocation}</td>
                          <td className="px-2 py-1">{d.focusAreas?.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h3 className="text-lg font-bold text-green-700 mb-2">Weekly Goals</h3>
                <ul className="list-disc list-inside mb-4">
                  {plan.weeklyGoals?.map((goal: string, i: number) => <li key={i}>{goal}</li>)}
                </ul>
                <h3 className="text-lg font-bold text-green-700 mb-2">Exam Strategy</h3>
                <ul className="list-disc list-inside">
                  {plan.examStrategy?.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            )}
          </section>
          {/* Study Assistant Chat */}
          <section className={`rounded-2xl shadow-xl p-6 border-2 ${dark ? 'bg-white/90 border-purple-100' : 'bg-white border-purple-200'}`}
            style={{ boxShadow: '0 4px 32px 0 rgba(109,40,217,0.10)' }}>
            <h2 className={`text-2xl font-bold mb-4 text-purple-900`}>Study Assistant Chat</h2>
            <div className="text-gray-800">
              <StudyChat isEnabled={true} />
            </div>
          </section>
        </div>
        {/* Right: Compact Focus Timer */}
        <aside className={`rounded-2xl shadow-xl flex flex-col items-center p-4 mt-2 ${dark ? 'bg-gradient-to-br from-[#23243a] via-[#1a1b2f] to-[#2d2255] border border-blue-900' : 'bg-white border border-blue-100'}`}
          style={{ minWidth: 0, maxWidth: 320 }}>
          {/* Timer Settings Toggle */}
          <button
            onClick={() => setSettingsOpen((open) => !open)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg mb-2 font-bold text-md transition ${dark ? 'bg-[#23243a] text-white hover:bg-[#181c2b]' : 'bg-blue-50 text-blue-900 hover:bg-blue-100'}`}
            aria-expanded={settingsOpen}
          >
            <span>Focus Session Settings</span>
            {settingsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {settingsOpen && (
            <div className="w-full mb-4 animate-fade-in">
              <div className="flex flex-col gap-2">
                <label className={`flex items-center gap-2 text-sm font-semibold ${dark ? 'text-white' : 'text-blue-900'}`}>
                  Focus (min):
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={focusMinutes}
                    onChange={e => updateTimerSettings(Number(e.target.value), breakMinutes, numBreaks)}
                    className={`w-16 px-2 py-1 rounded border ${dark ? 'border-blue-900 bg-[#23243a] text-white' : 'border-blue-200 text-blue-900'} focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold`}
                  />
                </label>
                <label className={`flex items-center gap-2 text-sm font-semibold ${dark ? 'text-white' : 'text-blue-900'}`}>
                  Break (min):
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={breakMinutes}
                    onChange={e => updateTimerSettings(focusMinutes, Number(e.target.value), numBreaks)}
                    className={`w-16 px-2 py-1 rounded border ${dark ? 'border-blue-900 bg-[#23243a] text-white' : 'border-blue-200 text-blue-900'} focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold`}
                  />
                </label>
                <label className={`flex items-center gap-2 text-sm font-semibold ${dark ? 'text-white' : 'text-blue-900'}`}>
                  Number of Breaks:
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={numBreaks}
                    onChange={e => updateTimerSettings(focusMinutes, breakMinutes, Number(e.target.value))}
                    className={`w-16 px-2 py-1 rounded border ${dark ? 'border-blue-900 bg-[#23243a] text-white' : 'border-blue-200 text-blue-900'} focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold`}
                  />
                </label>
              </div>
              {/* Daily Target */}
              <div className="w-full mt-4">
                <h3 className={`text-md font-bold mb-2 ${dark ? 'text-white' : 'text-blue-900'}`}>Daily Focus Target</h3>
                <label className={`flex items-center gap-2 text-sm font-semibold ${dark ? 'text-white' : 'text-blue-900'}`}>
                  Target (hours):
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={focusTarget}
                    onChange={e => setFocusTarget(Number(e.target.value))}
                    className={`w-16 px-2 py-1 rounded border ${dark ? 'border-blue-900 bg-[#23243a] text-white' : 'border-blue-200 text-blue-900'} focus:outline-none focus:ring-2 focus:ring-green-400 font-bold`}
                  />
                </label>
              </div>
            </div>
          )}
          {/* Progress Rings */}
          <div className="relative flex flex-col items-center mb-4">
            {/* Session Progress */}
            <svg width="120" height="120" className="absolute top-0 left-1/2 -translate-x-1/2 z-10" style={{ pointerEvents: 'none' }}>
              <circle cx="60" cy="60" r="54" fill="none" stroke={dark ? '#222' : '#e5e7eb'} strokeWidth="10" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke={mode === 'focus' ? '#2563eb' : '#22c55e'}
                strokeWidth="10"
                strokeLinecap="round"
                {...getProgress(secondsLeft / ((mode === 'focus' ? focusMinutes : breakMinutes) * 60))}
                style={{ transition: 'stroke-dashoffset 0.5s' }}
              />
            </svg>
            {/* Daily Progress */}
            <svg width="90" height="90" className="relative z-20" style={{ marginTop: 15 }}>
              <circle cx="45" cy="45" r="40" fill="none" stroke={dark ? '#222' : '#e5e7eb'} strokeWidth="8" />
              <circle
                cx="45" cy="45" r="40" fill="none"
                stroke="#f59e42"
                strokeWidth="8"
                strokeLinecap="round"
                {...getProgress(Math.min(focusCompleted / (focusTarget * 60), 1))}
                style={{ transition: 'stroke-dashoffset 0.5s' }}
              />
            </svg>
            <span className={`absolute top-[60px] left-1/2 -translate-x-1/2 text-lg font-bold ${dark ? 'text-white' : 'text-blue-900'}`}>{pad(minutes)}:{pad(seconds)}</span>
          </div>
          <div className="flex gap-2 mb-2">
            <button onClick={start} disabled={running} className="px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 text-sm">Start</button>
            <button onClick={pause} disabled={!running} className="px-4 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition disabled:opacity-50 text-sm">Pause</button>
            <button onClick={reset} className="px-4 py-1 rounded-lg bg-gray-700 hover:bg-gray-800 text-white font-semibold transition text-sm">Reset</button>
          </div>
          <div className={`mt-2 text-xs text-center ${dark ? 'text-white' : 'text-blue-900 font-semibold'}`}>{mode === 'focus' ? `Stay focused for ${focusMinutes} minutes!` : `Take a ${breakMinutes}-minute break!`}</div>
          <div className={`mt-2 text-xs text-center ${dark ? 'text-white' : 'text-blue-900 font-semibold'}`}>Total Focus Today: <span className="font-bold">{Math.floor(focusCompleted / 60)}h {focusCompleted % 60}m</span> / {focusTarget}h</div>
        </aside>
      </div>
    </main>
  );
} 