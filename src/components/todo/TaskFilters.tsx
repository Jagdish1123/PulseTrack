
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Dumbbell, Heart } from 'lucide-react';

interface TaskFiltersProps {
  filter: string;
  setFilter: (filter: string) => void;
  newTodoCategory: string;
  setNewTodoCategory: (category: string) => void;
}

const TaskFilters = ({ filter, setFilter, newTodoCategory, setNewTodoCategory }: TaskFiltersProps) => {
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

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={filter !== 'category' ? "outline" : "default"}
        size="sm"
        className={filter !== 'category' ? "text-sm h-7" : "text-sm h-7"}
        onClick={() => setFilter(filter !== 'category' ? 'all' : 'category')}
      >
        {filter === 'category' ? 'Clear Filter' : 'Filter by Category'}
      </Button>
      
      {filter !== 'category' && (
        <>
          <Button
            variant="outline"
            size="sm"
            className={`text-sm h-7 ${getBadgeColor('workout')}`}
            onClick={() => { setNewTodoCategory('workout'); setFilter('category'); }}
          >
            <Dumbbell className="h-3.5 w-3.5 mr-1" /> Workout
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`text-sm h-7 ${getBadgeColor('hydration')}`}
            onClick={() => { setNewTodoCategory('hydration'); setFilter('category'); }}
          >
            <Heart className="h-3.5 w-3.5 mr-1" /> Hydration
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`text-sm h-7 ${getBadgeColor('meditation')}`}
            onClick={() => { setNewTodoCategory('meditation'); setFilter('category'); }}
          >
            <Brain className="h-3.5 w-3.5 mr-1" /> Meditation
          </Button>
        </>
      )}
    </div>
  );
};

export default TaskFilters;
