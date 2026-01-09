
export enum InterviewMode {
  HR = 'HR',
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL'
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Feedback {
  score: number;
  strengths: string[];
  improvements: string[];
  overallSummary: string;
}

export interface ChatMessage {
  role: 'interviewer' | 'candidate';
  text: string;
  timestamp: number;
}
