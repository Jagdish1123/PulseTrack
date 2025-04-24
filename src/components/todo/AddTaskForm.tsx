
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';

interface AddTaskFormProps {
  onAddTask: (title: string, category: string) => void;
}

const AddTaskForm = ({ onAddTask }: AddTaskFormProps) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoCategory, setNewTodoCategory] = useState('workout');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    
    onAddTask(newTodoTitle, newTodoCategory);
    setNewTodoTitle('');
    toast.success('Task added successfully!');
  };

  return (
    <Card className="backdrop-blur-md bg-card/80 border border-white/10">
      <CardHeader className="pb-3">
        <CardTitle>Add New Task</CardTitle>
        <CardDescription>Create a new fitness task to track</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="e.g., 30 min morning workout"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="flex-1"
            />
            <select
              value={newTodoCategory}
              onChange={(e) => setNewTodoCategory(e.target.value)}
              className="h-10 rounded-md border border-input px-3 py-2 bg-background text-sm ring-offset-background"
            >
              <option value="workout">Workout</option>
              <option value="hydration">Hydration</option>
              <option value="nutrition">Nutrition</option>
              <option value="meditation">Meditation</option>
              <option value="mindfulness">Mindfulness</option>
            </select>
            <Button type="submit" className="group">
              <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" /> Add
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTaskForm;
