
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, InterviewMode } from '../types';
import { generateFollowUpQuestion, analyzePerformance } from '../services/geminiService';

interface InterviewSessionProps {
  role: string;
  level: string;
  mode: InterviewMode;
  initialQuestion: string;
  onFinish: (feedback: any) => void;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ role, level, mode, initialQuestion, onFinish }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'interviewer', text: initialQuestion, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const maxQuestions = 5;
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMsg = input.trim();
    setInput('');
    setIsRecording(false);
    recognitionRef.current?.stop();

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'candidate', text: userMsg, timestamp: Date.now() }
    ];
    setMessages(newMessages);

    if (questionCount >= maxQuestions) {
      setIsThinking(true);
      const history = newMessages.map(m => `${m.role}: ${m.text}`).join('\n');
      const feedback = await analyzePerformance(history);
      onFinish(feedback);
      return;
    }

    setIsThinking(true);
    try {
      const history = newMessages.map(m => `${m.role}: ${m.text}`).join('\n');
      const nextQ = await generateFollowUpQuestion(history, role, mode);
      setMessages([...newMessages, { role: 'interviewer', text: nextQ, timestamp: Date.now() }]);
      setQuestionCount(prev => prev + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{role} Interview</h2>
          <p className="text-slate-400 text-sm">{mode} Level - {level}</p>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Progress</div>
          <div className="flex gap-1">
            {[...Array(maxQuestions)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-1.5 rounded-full transition-all duration-500 ${i < questionCount ? 'bg-indigo-500' : 'bg-slate-700'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
              m.role === 'candidate' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
            }`}>
              <div className="text-[10px] uppercase font-bold opacity-60 mb-1">
                {m.role === 'candidate' ? 'You' : 'Interviewer'}
              </div>
              <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleRecording}
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-red-100 text-red-600 animate-pulse ring-4 ring-red-50' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {isRecording ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            )}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isRecording ? "Listening..." : "Type your response here..."}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            disabled={isThinking}
          />

          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
        {isRecording && (
          <p className="text-[10px] text-red-500 font-bold uppercase mt-2 text-center tracking-widest">Live transcription active</p>
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
