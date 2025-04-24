
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { CheckSquare, Calendar, Trash2, Brain, Heart, Dumbbell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AchievementBadges from '@/components/AchievementBadges';
import confetti from 'canvas-confetti';
import { Todo, AnalyticsViewType } from '@/types/todo';
import AddTaskForm from '@/components/todo/AddTaskForm';
import TaskFilters from '@/components/todo/TaskFilters';
import TaskDetailDialog from '@/components/todo/TaskDetailDialog';
import TaskAnalytics from '@/components/todo/TaskAnalytics';

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
        startTime: todo.startTime ? new Date(todo.startTime) : undefined,
        endTime: todo.endTime ? new Date(todo.endTime) : undefined
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
        startTime: new Date(Date.now() - 86400000 * 2 + 3600000), // 2 days ago + 1 hour
        endTime: new Date(Date.now() - 86400000 * 2 + 5400000), // 2 days ago + 1.5 hours
        duration: 30, // 30 minutes
      },
    ];
  });
  
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [analyticsView, setAnalyticsView] = useState<AnalyticsViewType>('weekly');
  const [newTodoCategory, setNewTodoCategory] = useState('workout');
  
  useEffect(() => {
    localStorage.setItem('fitness-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string, category: string, startTimeStr?: string, endTimeStr?: string) => {
    let startTime: Date | undefined = undefined;
    let endTime: Date | undefined = undefined;
    let duration: number | undefined = undefined;

    // If both start and end times are provided, calculate duration
    if (startTimeStr && endTimeStr) {
      const today = new Date();
      const [startHour, startMinute] = startTimeStr.split(':').map(Number);
      const [endHour, endMinute] = endTimeStr.split(':').map(Number);

      // Create Date objects for today with the specified times
      startTime = new Date(today);
      startTime.setHours(startHour, startMinute, 0, 0);

      endTime = new Date(today);
      endTime.setHours(endHour, endMinute, 0, 0);

      // Calculate duration in minutes
      if (endTime > startTime) {
        duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      } else {
        // Handle case where end time is on the next day
        duration = ((endTime.getTime() + 24 * 60 * 60 * 1000) - startTime.getTime()) / (1000 * 60);
      }
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      category,
      createdAt: new Date(),
      startTime,
      endTime,
      duration,
    };
    
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    const now = new Date();
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const newCompleted = !todo.completed;
        
        let updatedTodo = { ...todo, completed: newCompleted };
        
        // If completing a task that has a start time but no end time, add the end time
        if (newCompleted && todo.startTime && !todo.endTime) {
          updatedTodo.endTime = now;
          updatedTodo.duration = (now.getTime() - todo.startTime.getTime()) / (1000 * 60);
        }
        
        // If task is being marked as incomplete, remove end time and duration
        if (!newCompleted && todo.endTime) {
          updatedTodo.endTime = undefined;
          updatedTodo.duration = undefined;
        }
        
        // If completing a task, trigger confetti sometimes
        if (newCompleted && Math.random() > 0.7) {
          triggerConfetti();
          toast.success('Great job! 🎉');
        }
        
        return updatedTodo;
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
    const now = new Date();
    const uncompletedTasks = todos.filter(todo => !todo.completed);
    if (uncompletedTasks.length === 0) return;
    
    const updatedTodos = todos.map(todo => {
      if (!todo.completed) {
        let updatedTodo = { ...todo, completed: true };
        
        // If the task has a start time but no end time, add the end time
        if (todo.startTime && !todo.endTime) {
          updatedTodo.endTime = now;
          updatedTodo.duration = (now.getTime() - todo.startTime.getTime()) / (1000 * 60);
        }
        
        return updatedTodo;
      }
      return todo;
    });
    
    setTodos(updatedTodos);
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

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'workout': return 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'hydration': return 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300';
      case 'nutrition': return 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'meditation': return 'bg-purple-100 hover:bg-purple-200 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'mindfulness': return 'bg-violet-100 hover:bg-violet-200 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300';
      case 'work': return 'bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'study': return 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'personal': return 'bg-pink-100 hover:bg-pink-200 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300';
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
          Task Manager
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
                                <div className="flex flex-wrap gap-2 mt-1">
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
                                  {todo.startTime && (
                                    <span className="text-xs text-muted-foreground">
                                      Start: {todo.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                  )}
                                  {todo.endTime && (
                                    <span className="text-xs text-muted-foreground">
                                      End: {todo.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                  )}
                                  {todo.duration && (
                                    <span className="text-xs text-muted-foreground">
                                      ({Math.round(todo.duration)} min)
                                    </span>
                                  )}
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
            <TaskAnalytics 
              todos={todos} 
              analyticsView={analyticsView}
              setAnalyticsView={setAnalyticsView}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="backdrop-blur-md bg-card/80 border border-white/10">
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
