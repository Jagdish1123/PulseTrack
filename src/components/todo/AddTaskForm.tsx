
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

interface AddTaskFormProps {
  onAddTask: (title: string, category: string, startTime?: string, endTime?: string) => void;
}

const AddTaskForm = ({ onAddTask }: AddTaskFormProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('workout');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    
    onAddTask(newTodoTitle, newTodoCategory, startTime, endTime);
    setNewTodoTitle('');
    setStartTime('');
    setEndTime('');
    toast.success('Task added successfully!');
  };

  const categories = [
    { value: 'workout', label: 'Workout' },
    { value: 'hydration', label: 'Hydration' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'meditation', label: 'Meditation' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'work', label: 'Work' },
    { value: 'study', label: 'Study' },
    { value: 'personal', label: 'Personal' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Card className="backdrop-blur-md bg-card/80 border border-white/10">
      <CardHeader className="pb-3">
        <CardTitle>Add New Task</CardTitle>
        <CardDescription>Create a new task to track</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="e.g., Complete project presentation"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="flex-1"
            />
            <select
              value={newTodoCategory}
              onChange={(e) => setNewTodoCategory(e.target.value)}
              className="h-10 rounded-md border border-input px-3 py-2 bg-background text-sm ring-offset-background"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="startTime" className="text-sm font-medium mb-1 block">
                Start Time (optional)
              </label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="endTime" className="text-sm font-medium mb-1 block">
                End Time (optional)
              </label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="group h-10">
                <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" /> Add
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTaskForm;
