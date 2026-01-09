
import React, { useState } from 'react';
import { InterviewMode } from './types';
import { generateInitialQuestion } from './services/geminiService';
import InterviewSession from './components/InterviewSession';
import FeedbackDashboard from './components/FeedbackDashboard';

const App: React.FC = () => {
  const [step, setStep] = useState<'setup' | 'session' | 'feedback'>('setup');
  const [role, setRole] = useState('Frontend Engineer');
  const [level, setLevel] = useState('Senior');
  const [mode, setMode] = useState<InterviewMode>(InterviewMode.TECHNICAL);
  const [initialQuestion, setInitialQuestion] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      const question = await generateInitialQuestion(role, level, mode);
      setInitialQuestion(question || "Welcome! To start, could you introduce yourself and tell me about your background?");
      setStep('session');
    } catch (err) {
      alert("Failed to connect to AI. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const finishInterview = (results: any) => {
    setFeedback(results);
    setStep('feedback');
  };

  const reset = () => {
    setStep('setup');
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navigation */}
      <nav className="p-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">H</div>
          <span className="text-xl font-bold tracking-tight text-slate-800">HireAI</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">Resources</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">Sign In</button>
        </div>
      </nav>

      <main className="container mx-auto px-4 mt-8 md:mt-16">
        {step === 'setup' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                Master Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Interview</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-lg mx-auto">
                Practice with our advanced AI tailored to your role, level, and industry. Get actionable feedback instantly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Job Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Product Manager"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Expertise Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    >
                      <option>Junior</option>
                      <option>Mid-Level</option>
                      <option>Senior</option>
                      <option>Staff/Principal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Interview Type</label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as InterviewMode)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    >
                      <option value={InterviewMode.TECHNICAL}>Technical</option>
                      <option value={InterviewMode.HR}>HR / Cultural</option>
                      <option value={InterviewMode.BEHAVIORAL}>Behavioral</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={startInterview}
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center disabled:opacity-70 active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Preparing Interviewer...
                    </div>
                  ) : 'Start Mock Interview'}
                </button>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'AI-Adaptive', desc: 'Questions change based on your answers.', icon: '🧠' },
                { title: 'Voice Support', desc: 'Speak naturally or type your responses.', icon: '🎙️' },
                { title: 'Deep Metrics', desc: 'Detailed scorecards on clarity and knowledge.', icon: '📊' }
              ].map((feat, i) => (
                <div key={i} className="text-center p-4">
                  <div className="text-3xl mb-2">{feat.icon}</div>
                  <h3 className="font-bold text-slate-800">{feat.title}</h3>
                  <p className="text-sm text-slate-500">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'session' && (
          <InterviewSession
            role={role}
            level={level}
            mode={mode}
            initialQuestion={initialQuestion}
            onFinish={finishInterview}
          />
        )}

        {step === 'feedback' && feedback && (
          <FeedbackDashboard 
            feedback={feedback} 
            onRestart={reset}
          />
        )}
      </main>
    </div>
  );
};

export default App;
