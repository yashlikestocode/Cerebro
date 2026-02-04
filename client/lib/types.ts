export type TaskStatus = 'pending' | 'completed' | 'skipped';

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  duration: number; // in minutes
  status: TaskStatus;
  date: string; // ISO date string
  priority: 'low' | 'medium' | 'high';
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  totalHours: number;
}

export interface StudyPlan {
  id: string;
  name: string;
  examDate: string;
  dailyHours: number;
  subjects: Subject[];
  tasks: StudyTask[];
  createdAt: string;
}

export interface DailyStats {
  date: string;
  completed: number;
  skipped: number;
  pending: number;
  totalMinutes: number;
}

export interface WeeklyStats {
  week: string;
  completedTasks: number;
  skippedTasks: number;
  totalStudyMinutes: number;
}

export interface AIFeedback {
  id: string;
  message: string;
  type: 'info' | 'suggestion' | 'warning' | 'success';
  timestamp: string;
}
