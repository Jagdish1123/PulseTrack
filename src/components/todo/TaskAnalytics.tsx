
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { BarChart } from 'lucide-react';
import { Todo, AnalyticsData, TimeSpentData, AnalyticsViewType } from '@/types/todo';

interface TaskAnalyticsProps {
  todos: Todo[];
  analyticsView: AnalyticsViewType;
  setAnalyticsView: (view: AnalyticsViewType) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2', '#48C9B0', '#F4D03F'];

const TaskAnalytics = ({ todos, analyticsView, setAnalyticsView }: TaskAnalyticsProps) => {
  // Calculate completion rate
  const completedTodos = todos.filter(todo => todo.completed).length;
  const completionRate = todos.length > 0 ? (completedTodos / todos.length) * 100 : 0;

  // Helper function to format time data for charts
  const getTaskCountData = () => {
    const categoryMap: Record<string, { count: number, timeSpent: number }> = {};
    
    todos.forEach(todo => {
      if (!categoryMap[todo.category]) {
        categoryMap[todo.category] = { count: 0, timeSpent: 0 };
      }
      
      categoryMap[todo.category].count += 1;
      
      if (todo.completed && todo.duration) {
        categoryMap[todo.category].timeSpent += todo.duration;
      }
    });
    
    return Object.entries(categoryMap).map(([category, data]) => ({
      category,
      count: data.count,
      timeSpent: Math.round(data.timeSpent / 60 * 10) / 10 // Convert to hours with 1 decimal
    }));
  };

  // Function to get time-based analytics data
  const getTimeBasedData = (): AnalyticsData[] => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    if (analyticsView === 'daily') {
      // Show last 24 hours broken down by 3-hour periods
      const periods = ['12am-3am', '3am-6am', '6am-9am', '9am-12pm', '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am'];
      
      return periods.map(period => {
        const todosForPeriod = todos.filter(todo => {
          if (!todo.startTime) return false;
          const todoDate = new Date(todo.startTime);
          const hour = todoDate.getHours();
          
          if (period === '12am-3am') return hour >= 0 && hour < 3;
          if (period === '3am-6am') return hour >= 3 && hour < 6;
          if (period === '6am-9am') return hour >= 6 && hour < 9;
          if (period === '9am-12pm') return hour >= 9 && hour < 12;
          if (period === '12pm-3pm') return hour >= 12 && hour < 15;
          if (period === '3pm-6pm') return hour >= 15 && hour < 18;
          if (period === '6pm-9pm') return hour >= 18 && hour < 21;
          if (period === '9pm-12am') return hour >= 21 && hour < 24;
          return false;
        });
        
        return {
          day: period,
          completed: todosForPeriod.filter(todo => todo.completed).length,
          total: todosForPeriod.length,
        };
      });
    } else if (analyticsView === 'weekly') {
      return days.map(day => {
        const dayOfWeek = days.indexOf(day);
        const targetDate = new Date(today);
        
        const diff = dayOfWeek - today.getDay();
        targetDate.setDate(today.getDate() + diff);
        
        const todosForDay = todos.filter(todo => {
          const todoDate = new Date(todo.createdAt);
          return todoDate.getDate() === targetDate.getDate() && 
                 todoDate.getMonth() === targetDate.getMonth() && 
                 todoDate.getFullYear() === targetDate.getFullYear();
        });
        
        return {
          day,
          completed: todosForDay.filter(todo => todo.completed).length,
          total: todosForDay.length,
        };
      });
    } else {
      // Monthly view - show weeks
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      const weeks = [
        { day: 'Week 1', completed: 0, total: 0 },
        { day: 'Week 2', completed: 0, total: 0 },
        { day: 'Week 3', completed: 0, total: 0 },
        { day: 'Week 4', completed: 0, total: 0 }
      ];
      
      todos.forEach(todo => {
        const todoDate = new Date(todo.createdAt);
        
        if (todoDate.getMonth() === currentMonth && todoDate.getFullYear() === currentYear) {
          const dayOfMonth = todoDate.getDate();
          let weekIndex = Math.floor((dayOfMonth - 1) / 7);
          if (weekIndex > 3) weekIndex = 3;
          
          weeks[weekIndex].total++;
          if (todo.completed) {
            weeks[weekIndex].completed++;
          }
        }
      });
      
      return weeks;
    }
  };

  // Get time spent by category
  const getTimeSpentByCategory = (): TimeSpentData[] => {
    const categoryTimeMap: Record<string, number> = {};
    
    todos.forEach(todo => {
      if (todo.completed && todo.duration) {
        if (!categoryTimeMap[todo.category]) {
          categoryTimeMap[todo.category] = 0;
        }
        categoryTimeMap[todo.category] += todo.duration;
      }
    });
    
    return Object.entries(categoryTimeMap)
      .map(([category, timeSpent]) => ({
        category,
        timeSpent: Math.round(timeSpent / 60 * 10) / 10 // Convert to hours with 1 decimal
      }))
      .sort((a, b) => b.timeSpent - a.timeSpent)
      .slice(0, 5); // Top 5 categories by time spent
  };

  const timeBasedData = getTimeBasedData();
  const categoryData = getTaskCountData();
  const timeSpentData = getTimeSpentByCategory();

  return (
    <Card className="backdrop-blur-md bg-card/80 border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" /> Task Analytics
        </CardTitle>
        <CardDescription>Your progress tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={analyticsView} 
          onValueChange={(value) => setAnalyticsView(value as AnalyticsViewType)}
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <motion.div 
              key="daily"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-60"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={timeBasedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'completed' ? 'Completed Tasks' : 'Total Tasks']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.95)' }}
                  />
                  <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </ReBarChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <motion.div 
              key="weekly"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-60"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={timeBasedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'completed' ? 'Completed Tasks' : 'Total Tasks']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.95)' }}
                  />
                  <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </ReBarChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="monthly">
            <motion.div 
              key="monthly"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-60"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={timeBasedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'completed' ? 'Completed Tasks' : 'Total Tasks']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.95)' }}
                  />
                  <Bar dataKey="total" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </ReBarChart>
              </ResponsiveContainer>
            </motion.div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Completion Rate</span>
              <span>{completionRate.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              ></motion.div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Time Spent by Category</h3>
          <div className="h-60">
            {timeSpentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeSpentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="timeSpent"
                    nameKey="category"
                    label={({ category, timeSpent }) => `${category}: ${timeSpent}h`}
                  >
                    {timeSpentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} hours`, 'Time Spent']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.95)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No completed tasks with time data yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Card className="bg-green-50/50 border-none dark:bg-green-900/10">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground">Completed</div>
              <div className="text-xl font-semibold">{completedTodos}</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50/50 border-none dark:bg-blue-900/10">
            <CardContent className="p-3">
              <div className="text-xs text-muted-foreground">Total Tasks</div>
              <div className="text-xl font-semibold">{todos.length}</div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskAnalytics;
