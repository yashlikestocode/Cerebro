import { create } from 'zustand';
import type { StudyTask, Subject, StudyPlan, AIFeedback, TaskStatus } from './types';

interface AppState {
  currentView: 'dashboard' | 'plan' | 'create' | 'analytics';
  setCurrentView: (view: AppState['currentView']) => void;
  
  plan: StudyPlan | null;
  setPlan: (plan: StudyPlan) => void;
  
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  
  aiFeedback: AIFeedback[];
  addFeedback: (feedback: AIFeedback) => void;
  clearFeedback: () => void;
  
  streak: number;
  setStreak: (streak: number) => void;
}

// Sample data for demo
const sampleSubjects: Subject[] = [
  { id: '1', name: 'Mathematics', color: '#a855f7', totalHours: 20 },
  { id: '2', name: 'Physics', color: '#06b6d4', totalHours: 15 },
  { id: '3', name: 'Chemistry', color: '#22c55e', totalHours: 12 },
  { id: '4', name: 'Biology', color: '#eab308', totalHours: 10 },
];

const generateSampleTasks = (): StudyTask[] => {
  const tasks: StudyTask[] = [];
  const today = new Date();
  const topics = {
    Mathematics: ['Calculus', 'Linear Algebra', 'Probability', 'Statistics', 'Trigonometry'],
    Physics: ['Mechanics', 'Thermodynamics', 'Optics', 'Electromagnetism', 'Waves'],
    Chemistry: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Biochemistry'],
    Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Evolution', 'Anatomy'],
  };

  let taskId = 1;
  for (let day = -3; day <= 7; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    
    sampleSubjects.forEach((subject, idx) => {
      if (Math.random() > 0.3) {
        const subjectTopics = topics[subject.name as keyof typeof topics];
        const topic = subjectTopics[Math.floor(Math.random() * subjectTopics.length)];
        
        let status: TaskStatus = 'pending';
        if (day < 0) {
          status = Math.random() > 0.2 ? 'completed' : 'skipped';
        } else if (day === 0 && idx < 2) {
          status = 'completed';
        }
        
        tasks.push({
          id: String(taskId++),
          subject: subject.name,
          topic,
          duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
          status,
          date: dateStr,
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        });
      }
    });
  }
  
  return tasks;
};

const samplePlan: StudyPlan = {
  id: '1',
  name: 'Final Exam Prep',
  examDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dailyHours: 4,
  subjects: sampleSubjects,
  tasks: generateSampleTasks(),
  createdAt: new Date().toISOString(),
};

const initialFeedback: AIFeedback[] = [
  {
    id: '1',
    message: 'Great progress! You\'ve completed 85% of your weekly goals.',
    type: 'success',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    message: 'Consider adding more breaks between Physics sessions to improve retention.',
    type: 'suggestion',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    message: 'Plan adjusted to reduce burnout. Heavy topics spread across multiple days.',
    type: 'info',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const useAppStore = create<AppState>((set) => ({
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),
  
  plan: samplePlan,
  setPlan: (plan) => set({ plan }),
  
  updateTaskStatus: (taskId, status) => set((state) => {
    if (!state.plan) return state;
    return {
      plan: {
        ...state.plan,
        tasks: state.plan.tasks.map((task) =>
          task.id === taskId ? { ...task, status } : task
        ),
      },
    };
  }),
  
  aiFeedback: initialFeedback,
  addFeedback: (feedback) => set((state) => ({
    aiFeedback: [feedback, ...state.aiFeedback],
  })),
  clearFeedback: () => set({ aiFeedback: [] }),
  
  streak: 7,
  setStreak: (streak) => set({ streak }),
}));
