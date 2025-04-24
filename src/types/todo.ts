
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  createdAt: Date;
  notes?: string;
  favorite?: boolean;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in minutes
};

export type AnalyticsData = {
  day: string;
  completed: number;
  total: number;
};

export type TimeSpentData = {
  category: string;
  timeSpent: number;
};

export type AnalyticsViewType = 'daily' | 'weekly' | 'monthly';
