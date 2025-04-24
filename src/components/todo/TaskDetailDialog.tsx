
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Todo } from '@/types/todo';

interface TaskDetailDialogProps {
  selectedTask: Todo | null;
  taskNotes: string;
  onOpenChange: (open: boolean) => void;
  onTaskNotesChange: (notes: string) => void;
  onUpdateNotes: () => void;
  onToggleFavorite: (id: string) => void;
  getBadgeColor: (category: string) => string;
}

const TaskDetailDialog = ({
  selectedTask,
  taskNotes,
  onOpenChange,
  onTaskNotesChange,
  onUpdateNotes,
  onToggleFavorite,
  getBadgeColor
}: TaskDetailDialogProps) => {
  if (!selectedTask) return null;

  return (
    <Dialog open={!!selectedTask} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedTask.title}</DialogTitle>
          <DialogDescription>
            Created on {new Date(selectedTask.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getBadgeColor(selectedTask.category)}>
              {selectedTask.category}
            </Badge>
            <Badge variant={selectedTask.completed ? "default" : "outline"}>
              {selectedTask.completed ? "Completed" : "Active"}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Notes</label>
            <textarea 
              id="notes"
              className="w-full p-2 min-h-[100px] border rounded-md bg-background"
              placeholder="Add notes for this task..."
              value={taskNotes || selectedTask.notes || ''}
              onChange={(e) => onTaskNotesChange(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              className={selectedTask.favorite ? "text-amber-500 border-amber-500/50" : ""}
              onClick={() => onToggleFavorite(selectedTask.id)}
            >
              {selectedTask.favorite ? "⭐ Favorited" : "Add to Favorites"}
            </Button>
            
            <Button onClick={onUpdateNotes}>Save Notes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
