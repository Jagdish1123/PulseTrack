
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { CheckSquare, Calendar, BarChart, Trash2, Brain, Heart, Dumbbell } from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementBadges from '@/components/AchievementBadges';
import confetti from 'canvas-confetti';
import { Todo, AnalyticsData } from '@/types/todo';
import AddTaskForm from '@/components/todo/AddTaskForm';
import TaskFilters from '@/components/todo/TaskFilters';
import TaskDetailDialog from '@/components/todo/TaskDetailDialog';

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.6 }
  });
};

const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('fitness-todos');
    if (savedTodos) {
      return JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
    }
    return [
      {
        id: '1',
        title: 'Morning Yoga - 20 min',
        completed: false,
        category: 'workout',
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Drink 2 glasses of water',
        completed: true,
        category: 'hydration',
        createdAt: new Date(),
      },
      {
        id: '3',
        title: '30 min Cardio Session',
        completed: false,
        category: 'workout',
        createdAt: new Date(),
      },
      {
        id: '4',
        title: 'Protein Shake',
        completed: true,
        category: 'nutrition',
        createdAt: new Date(),
      },
      {
        id: '5',
        title: 'Meditation - 10 min',
        completed: false,
        category: 'meditation',
        createdAt: new Date(Date.now() - 86400000), // Yesterday
      },
      {
        id: '6',
        title: 'Read health article',
        completed: true,
        category: 'mindfulness',
        createdAt: new Date(Date.now() - 86400000), // Yesterday
      },
      {
        id: '7',
        title: 'Track calories',
        completed: false,
        category: 'nutrition',
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      },
      {
        id: '8',
        title: 'Stretch routine',
        completed: true,
        category: 'workout',
        createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      },
    ];
  });
  
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('workout');
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [analyticsView, setAnalyticsView] = useState('weekly');
  
  useEffect(() => {
    localStorage.setItem('fitness-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, category: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      category,
      createdAt: new Date(),
    };
    
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const newCompleted = !todo.completed;
        
        // If completing a task, trigger confetti sometimes
        if (newCompleted && Math.random() > 0.7) {
          triggerConfetti();
          toast.success('Great job! 🎉');
        }
        
        return { ...todo, completed: newCompleted };
      }
      return todo;
    });
    setTodos(updatedTodos);
    
    // Check if all tasks for today are completed
    const todayTodos = updatedTodos.filter(todo => {
      const todoDate = new Date(todo.createdAt);
      const today = new Date();
      return todoDate.getDate() === today.getDate() && 
             todoDate.getMonth() === today.getMonth() && 
             todoDate.getFullYear() === today.getFullYear();
    });
    
    const allCompleted = todayTodos.length > 0 && todayTodos.every(todo => todo.completed);
    
    if (allCompleted) {
      triggerConfetti();
      toast.success('All tasks completed today! 🎉');
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.info('Task removed');
  };
  
  const toggleFavorite = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, favorite: !todo.favorite } : todo
    ));
  };
  
  const updateTaskNotes = () => {
    if (!selectedTask) return;
    
    setTodos(todos.map(todo => 
      todo.id === selectedTask.id ? { ...todo, notes: taskNotes } : todo
    ));
    
    toast.success('Task notes updated!');
    setSelectedTask(null);
  };

  const completeAllTasks = () => {
    const uncompletedTasks = todos.filter(todo => !todo.completed);
    if (uncompletedTasks.length === 0) return;
    
    setTodos(todos.map(todo => ({ ...todo, completed: true })));
    triggerConfetti();
    toast.success('All tasks marked as complete! 🎉');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    if (filter === 'category') return todo.category === newTodoCategory;
    return true;
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData: AnalyticsData[] = days.map(day => {
    const dayOfWeek = days.indexOf(day);
    const today = new Date();
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

  const getMonthlyData = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const weeks: AnalyticsData[] = [
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
  };

  const monthlyData = getMonthlyData();

  const completedTodos = todos.filter(todo => todo.completed).length;
  const completionRate = todos.length > 0 ? (completedTodos / todos.length) * 100 : 0;

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'workout': return 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'hydration': return 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300';
      case 'nutrition': return 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'meditation': return 'bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'mindfulness': return 'bg-violet-100 hover:bg-violet-200 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300';
      default: return 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workout': return <Dumbbell className="h-3 w-3" />;
      case 'hydration': return <Heart className="h-3 w-3" />;
      case 'nutrition': return <Heart className="h-3 w-3" />;
      case 'meditation': return <Brain className="h-3 w-3" />;
      case 'mindfulness': return <Brain className="h-3 w-3" />;
      default: return <Heart className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Fitness Tasks
        </motion.h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'active' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'completed' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AddTaskForm onAddTask={addTodo} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="backdrop-blur-md bg-card/80 border border-white/10">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" /> Task List
                  </CardTitle>
                  <CardDescription>
                    {`${todos.filter(todo => todo.completed).length} of ${todos.length} tasks completed`}
                  </CardDescription>
                </div>
                
                {todos.some(todo => !todo.completed) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={completeAllTasks}
                    className="ml-auto"
                  >
                    Complete All
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <TaskFilters 
                  filter={filter}
                  setFilter={setFilter}
                  newTodoCategory={newTodoCategory}
                  setNewTodoCategory={setNewTodoCategory}
                />
              
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredTodos.length > 0 ? (
                      filteredTodos.map((todo) => (
                        <motion.div
                          key={todo.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div 
                            className={`flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors ${todo.favorite ? 'border-amber-300/50' : ''}`}
                            onClick={() => setSelectedTask(todo)}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox 
                                checked={todo.completed}
                                onCheckedChange={() => toggleTodo(todo.id)}
                                className="h-5 w-5"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div>
                                <p className={todo.completed ? "line-through text-muted-foreground" : ""}>
                                  {todo.title}
                                </p>
                                <div className="flex gap-2 mt-1">
                                  <Badge variant="outline" className={getBadgeColor(todo.category)}>
                                    <span className="flex items-center gap-1">
                                      {getCategoryIcon(todo.category)}
                                      {todo.category}
                                    </span>
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(todo.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTodo(todo.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-8 text-center text-muted-foreground"
                      >
                        <CheckSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p>No tasks found</p>
                        <p className="text-sm">Add a new task to get started</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="backdrop-blur-md bg-card/80 border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" /> Task Analytics
                </CardTitle>
                <CardDescription>Your progress tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue="weekly" 
                  value={analyticsView}
                  onValueChange={setAnalyticsView}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="weekly">
                    <motion.div 
                      key="weekly"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-60"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        <ReBarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="backdrop-blur-md bg-card/80 border border-white/10 ">
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your badges and streaks</CardDescription>
              </CardHeader>
              <CardContent>
                <AchievementBadges />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      <TaskDetailDialog
        selectedTask={selectedTask}
        taskNotes={taskNotes}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        onTaskNotesChange={setTaskNotes}
        onUpdateNotes={updateTaskNotes}
        onToggleFavorite={toggleFavorite}
        getBadgeColor={getBadgeColor}
      />
    </div>
  );
};

export default TodoPage;
