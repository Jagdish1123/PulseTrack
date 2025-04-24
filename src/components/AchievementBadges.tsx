
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from 'framer-motion';

type Achievement = {
  id: string;
  title: string;
  description: string;
  category: 'hydration' | 'workout' | 'nutrition' | 'sleep' | 'mindfulness';
  unlocked: boolean;
  icon: string;
  progress?: number;
  total?: number;
};

const achievements: Achievement[] = [
  { 
    id: '1', 
    title: '5-Day Streak', 
    description: 'Completed tasks for 5 days in a row', 
    category: 'workout', 
    unlocked: true, 
    icon: '🔥' 
  },
  { 
    id: '2', 
    title: 'Hydration Hero', 
    description: 'Drank 8 glasses of water for 7 days', 
    category: 'hydration', 
    unlocked: true, 
    icon: '💧' 
  },
  { 
    id: '3', 
    title: 'Early Riser', 
    description: 'Worked out before 8 AM 3 times', 
    category: 'workout', 
    unlocked: true, 
    icon: '🌅' 
  },
  { 
    id: '4', 
    title: 'Nutrition Pro', 
    description: 'Tracked meals for 10 consecutive days', 
    category: 'nutrition',
    unlocked: true, 
    icon: '🥗' 
  },
  { 
    id: '5', 
    title: 'Zen Master', 
    description: 'Completed 5 meditation sessions', 
    category: 'mindfulness', 
    unlocked: false,
    progress: 3, 
    total: 5,
    icon: '🧘' 
  },
  { 
    id: '6', 
    title: 'Marathon Runner', 
    description: 'Run a total of 42km', 
    category: 'workout', 
    unlocked: false, 
    progress: 28, 
    total: 42,
    icon: '🏃' 
  },
  { 
    id: '7', 
    title: 'Sleep Champion', 
    description: 'Sleep 8+ hours for 7 consecutive days', 
    category: 'sleep', 
    unlocked: false, 
    progress: 4, 
    total: 7,
    icon: '😴' 
  },
  { 
    id: '8', 
    title: 'Super Hydrated', 
    description: 'Drink 10+ glasses of water in a day', 
    category: 'hydration', 
    unlocked: false, 
    progress: 8, 
    total: 10,
    icon: '🚰' 
  },
];

const getBadgeClass = (category: string, unlocked: boolean) => {
  if (!unlocked) return 'bg-muted/50 hover:bg-muted text-muted-foreground py-1 px-3';
  
  switch (category) {
    case 'hydration':
      return 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 py-1 px-3';
    case 'workout':
      return 'bg-amber-100 hover:bg-amber-200 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 py-1 px-3';
    case 'nutrition':
      return 'bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300 py-1 px-3';
    case 'sleep':
      return 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 py-1 px-3';
    case 'mindfulness':
      return 'bg-violet-100 hover:bg-violet-200 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 py-1 px-3';
    default:
      return 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 py-1 px-3';
  }
};

const AchievementBadges = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const filteredAchievements = achievements.filter(
    achievement => activeCategory === 'all' || achievement.category === activeCategory
  );

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {achievements
          .filter(achievement => achievement.unlocked)
          .slice(0, 4)
          .map((achievement) => (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Badge 
                className={`${getBadgeClass(achievement.category, true)} cursor-pointer`}
                onClick={() => setSelectedAchievement(achievement)}
              >
                {achievement.icon} {achievement.title}
              </Badge>
            </motion.div>
          ))}
      </div>
      
      <Dialog open={!!selectedAchievement} onOpenChange={(open) => !open && setSelectedAchievement(null)}>
        {selectedAchievement && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedAchievement.icon} {selectedAchievement.title}</DialogTitle>
              <DialogDescription>{selectedAchievement.description}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="text-sm text-muted-foreground mb-4">
                Category: {selectedAchievement.category.charAt(0).toUpperCase() + selectedAchievement.category.slice(1)}
              </div>
              {selectedAchievement.progress && selectedAchievement.total && (
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{selectedAchievement.progress}/{selectedAchievement.total}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(selectedAchievement.progress / selectedAchievement.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
      
      <Dialog>
        <DialogTrigger asChild>
          <button className="text-sm text-primary hover:underline mt-2">View All</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto fixed top-5 right-5">
          <DialogHeader>
            <DialogTitle>Achievements</DialogTitle>
            <DialogDescription>
              Track your progress and earn badges for healthy habits
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="all" className="mt-4">
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="hydration">Hydration</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${achievement.unlocked ? 'bg-card' : 'bg-muted/30'}`}
                    >
                      <div className={`text-2xl ${!achievement.unlocked && 'opacity-40'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className={`font-medium ${!achievement.unlocked && 'text-muted-foreground'}`}>
                          {achievement.title}
                          {achievement.unlocked && (
                            <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                              Unlocked
                            </span>
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        {achievement.progress !== undefined && achievement.total && (
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-muted rounded-full">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
            
            {['workout', 'hydration', 'nutrition', 'sleep', 'mindfulness'].map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <AnimatePresence mode="popLayout">
                    {achievements
                      .filter(a => a.category === category)
                      .map((achievement) => (
                        <motion.div
                          key={achievement.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className={`flex items-start gap-3 p-3 rounded-lg border ${achievement.unlocked ? 'bg-card' : 'bg-muted/30'}`}
                        >
                          <div className={`text-2xl ${!achievement.unlocked && 'opacity-40'}`}>
                            {achievement.icon}
                          </div>
                          <div>
                            <h4 className={`font-medium ${!achievement.unlocked && 'text-muted-foreground'}`}>
                              {achievement.title}
                              {achievement.unlocked && (
                                <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400">
                                  Unlocked
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                            {achievement.progress !== undefined && achievement.total && (
                              <div className="mt-2">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Progress</span>
                                  <span>{achievement.progress}/{achievement.total}</span>
                                </div>
                                <div className="w-full h-1.5 bg-muted rounded-full">
                                  <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AchievementBadges;
