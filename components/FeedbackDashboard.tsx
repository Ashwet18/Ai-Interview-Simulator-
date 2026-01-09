
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Feedback } from '../types';

interface FeedbackDashboardProps {
  feedback: Feedback;
  onRestart: () => void;
}

const FeedbackDashboard: React.FC<FeedbackDashboardProps> = ({ feedback, onRestart }) => {
  const data = [
    { name: 'Score', value: feedback.score },
    { name: 'Remaining', value: 100 - feedback.score },
  ];

  const radarData = [
    { subject: 'Confidence', A: Math.min(100, feedback.score + 5), fullMark: 100 },
    { subject: 'Clarity', A: Math.min(100, feedback.score - 5), fullMark: 100 },
    { subject: 'Technical', A: feedback.score, fullMark: 100 },
    { subject: 'Behavioral', A: Math.min(100, feedback.score + 10), fullMark: 100 },
    { subject: 'Engagement', A: feedback.score, fullMark: 100 },
  ];

  const COLORS = ['#4F46E5', '#E5E7EB'];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Performance Analysis</h2>
        <p className="text-slate-500">Comprehensive breakdown of your interview session</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl">
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold text-indigo-600">{feedback.score}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Score</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 text-center italic">
            "{feedback.overallSummary}"
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 h-48 md:h-auto">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Candidate" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-5 border border-green-100 bg-green-50/30 rounded-xl">
          <h3 className="font-bold text-green-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Key Strengths
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm text-slate-700 leading-relaxed">• {s}</li>
            ))}
          </ul>
        </div>

        <div className="p-5 border border-indigo-100 bg-indigo-50/30 rounded-xl">
          <h3 className="font-bold text-indigo-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Areas for Growth
          </h3>
          <ul className="space-y-2">
            {feedback.improvements.map((imp, i) => (
              <li key={i} className="text-sm text-slate-700 leading-relaxed">• {imp}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
      >
        Start New Session
      </button>
    </div>
  );
};

export default FeedbackDashboard;
