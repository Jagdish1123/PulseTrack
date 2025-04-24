
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  createdAt: Date;
  notes?: string;
  favorite?: boolean;
};

export type AnalyticsData = {
  day: string;
  completed: number;
  total: number;
};
