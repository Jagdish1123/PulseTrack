import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
// import { Activity, Heart, Dumbbell, Brain, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/components/ui/sonner';
import HealthReport from '@/components/HealthReport';
import confetti from 'canvas-confetti';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Link } from 'react-router-dom';
import { Activity, Heart, Dumbbell, Brain, Flame, Droplet, Moon, Footprints } from 'lucide-react';

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { x: 0.5, y: 0.6 }
  });
};

const Dashboard = () => {
  const { user } = useAuth();
  const { toast: uiToast } = useToast();
  
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 72,
    o2Level: 98,
    steps: 7893,
    activeMinutes: 42,
    water: 5,
    calories: 1240,
    sleep: 7.5,
    workouts: 3,
    meditationMinutes: 10,
    stretchingSessions: 1,
    proteinIntake: 50,
    fiberIntake: 20,
    screenTime: 2,
    moodRating: 8
  });

  const [showInputDialog, setShowInputDialog] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const healthBenefits = [
    {
      title: 'Yoga',
      description: 'Increases flexibility, reduces stress',
      icon: Flame,
      color: 'bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-300',
      progress: 75
    },
    {
      title: 'Gym',
      description: 'Boosts strength, improves metabolism',
      icon: Dumbbell,
      color: 'bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-300',
      progress: 60
    },
    {
      title: 'Mental Health',
      description: 'Meditation, better focus, and sleep',
      icon: Brain,
      color: 'bg-green-100 text-green-500 dark:bg-green-900/30 dark:text-green-300',
      progress: 40
    },
    {
      title: 'Cardio',
      description: 'Improves heart health, stamina',
      icon: Heart,
      color: 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-300',
      progress: 80
    }
  ];

  const handleUpdateData = () => {
    const newValue = parseInt(inputValue);
    
    if (isNaN(newValue) || newValue < 0) {
      uiToast({
        title: "Invalid value",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }
    
    if (showInputDialog) {
      setHealthMetrics(prev => ({
        ...prev,
        [showInputDialog]: newValue
      }));

      toast.success(`${showInputDialog.charAt(0).toUpperCase() + showInputDialog.slice(1)} updated!`);
      
      if (showInputDialog === 'steps' && newValue >= 10000) {
        triggerConfetti();
        uiToast({
          title: "Achievement Unlocked! 🎉",
          description: "You've reached 10,000 steps today!",
        });
      }
      
      if (showInputDialog === 'water' && newValue >= 8) {
        triggerConfetti();
        uiToast({
          title: "Achievement Unlocked! 💧",
          description: "You've completed your daily water intake goal!",
        });
      }
      
      setShowInputDialog(null);
      setInputValue('');
    }
  };

  const handleViewReport = () => {
  };

  const handleUpdateGoals = () => {
    uiToast({
      title: "Goals Updated",
      description: "Your fitness goals have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button 
            variant="outline"
            className="group transition-all hover:bg-primary/10"
          >
            <span className="mr-1">This Week</span>
            <Activity className="h-4 w-4 group-hover:text-primary transition-colors" />
          </Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardTitle>Welcome back, {user?.name?.split(' ')[0]}!</CardTitle>
              <CardDescription>Here's your health overview for today.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Avatar className="h-16 w-16 border-4 border-primary/20 ring-2 ring-offset-2 ring-primary/30">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback className="text-lg bg-gradient-to-br from-primary/50 to-secondary/50">{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="space-y-1">
                  <h3 className="font-medium">{user?.name}</h3>
                  <div className="text-sm text-muted-foreground">{user?.role}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 text-primary">Super User</Badge>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Badge variant="secondary" className="bg-secondary/10 hover:bg-secondary/20 text-secondary">Fitness Lover</Badge>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <Card variant="gradient" className="border-none" onClick={() => setShowInputDialog('heartRate')}>
                  <CardContent className="p-4 flex flex-col items-center cursor-pointer hover:bg-primary/5 transition-colors rounded-lg">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }} 
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Heart className="text-health-heartRate h-6 w-6 mb-2" />
                    </motion.div>
                    <div className="text-xs text-muted-foreground">Heart Rate</div>
                    <div className="text-xl font-semibold">{healthMetrics.heartRate} BPM</div>
                  </CardContent>
                </Card>
                <Card variant="gradient" className="border-none" onClick={() => setShowInputDialog('o2Level')}>
                  <CardContent className="p-4 flex flex-col items-center cursor-pointer hover:bg-primary/5 transition-colors rounded-lg">
                    <Activity className="text-health-o2Level h-6 w-6 mb-2" />
                    <div className="text-xs text-muted-foreground">O2 Level</div>
                    <div className="text-xl font-semibold">{healthMetrics.o2Level}%</div>
                  </CardContent>
                </Card>
                <Card variant="gradient" className="border-none" onClick={() => setShowInputDialog('steps')}>
                  <CardContent className="p-4 flex flex-col items-center cursor-pointer hover:bg-primary/5 transition-colors rounded-lg">
                    <Activity className="text-health-stepCount h-6 w-6 mb-2" />
                    <div className="text-xs text-muted-foreground">Steps</div>
                    <div className="text-xl font-semibold">{healthMetrics.steps.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card variant="gradient" className="border-none" onClick={() => setShowInputDialog('activeMinutes')}>
                  <CardContent className="p-4 flex flex-col items-center cursor-pointer hover:bg-primary/5 transition-colors rounded-lg">
                    <Activity className="text-health-activeMinutes h-6 w-6 mb-2" />
                    <div className="text-xs text-muted-foreground">Active</div>
                    <div className="text-xl font-semibold">{healthMetrics.activeMinutes} min</div>
                  </CardContent>
                </Card>

   
              {/* Water Intake */}
                <Card variant="gradient" className="border-none" onClick={() => setShowInputDialog('water')}>
                  <CardContent className="p-4 flex flex-col items-center cursor-pointer hover:bg-primary/5 transition-colors rounded-lg">
                    <Droplet className="text-blue-400 h-6 w-6 mb-2" />
                    <div className="text-xs text-muted-foreground">Water Intake</div>
                    <div className="text-xl font-semibold">{healthMetrics.water} glasses</div>
                  </CardContent>
                </Card>

                {/* Calories Burned */}
                <Card variant="gradient" className="border-none" onClick={() => setShowInputDialog('calories')}>
                  <CardContent className="p-4 flex flex-col items-center cursor-pointer hover:bg-primary/5 transition-colors rounded-lg">
                    <Flame className="text-orange-500 h-6 w-6 mb-2" />
                    <div className="text-xs text-muted-foreground">Calories Burned</div>
                    <div className="text-xl font-semibold">{healthMetrics.calories.toLocaleString()} cal</div>
                  </CardContent>
                </Card>

                {/* Sleep Hours */}
                <Card variant="gradient" className="border-none" onClick={() => setShowInputDialog('sleep')}>
                  <CardContent className="p-4 flex flex-col items-center cursor-pointer hover:bg-primary/5 transition-colors rounded-lg">
                    <Moon className="text-purple-500 h-6 w-6 mb-2" />
                    <div className="text-xs text-muted-foreground">Sleep Hours</div>
                    <div className="text-xl font-semibold">{healthMetrics.sleep} hrs</div>
                  </CardContent>
                </Card>

                {/* Workout Sessions */}
                <Card variant="gradient" className="border-none" onClick={() => setShowInputDialog('workouts')}>
                  <CardContent className="p-4 flex flex-col items-center cursor-pointer hover:bg-primary/5 transition-colors rounded-lg">
                    <Dumbbell className="text-green-500 h-6 w-6 mb-2" />
                    <div className="text-xs text-muted-foreground">Workout Sessions</div>
                    <div className="text-xl font-semibold">{healthMetrics.workouts} sessions</div>
                  </CardContent>
                </Card>

              </div>
            </CardContent>
            <CardFooter>
              <HealthReport user={user} />
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card variant="glass" className="h-full">
            <CardHeader>
              <CardTitle>Daily Goals</CardTitle>
              <CardDescription>Your progress today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2" onClick={() => setShowInputDialog('calories')}>
                <div className="flex justify-between text-sm">
                  <span>Calories</span>
                  <span className="font-medium">{healthMetrics.calories.toLocaleString()} / 2,200</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Progress value={(healthMetrics.calories / 2200) * 100} className="h-2" />
                </motion.div>
              </div>

              <div className="space-y-2" onClick={() => setShowInputDialog('meditationMinutes')}>
                <div className="flex justify-between text-sm">
                  <span>Meditation Minutes</span>
                  <span className="font-medium">{healthMetrics.meditationMinutes} / 20 min</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <Progress value={(healthMetrics.meditationMinutes / 20) * 100} className="h-2" />
                </motion.div>
              </div>

              <div className="space-y-2" onClick={() => setShowInputDialog('stretchingSessions')}>
                <div className="flex justify-between text-sm">
                  <span>Stretching Sessions</span>
                  <span className="font-medium">{healthMetrics.stretchingSessions} / 3 sessions</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Progress value={(healthMetrics.stretchingSessions / 3) * 100} className="h-2" />
                </motion.div>
              </div>

              <div className="space-y-2" onClick={() => setShowInputDialog('proteinIntake')}>
                <div className="flex justify-between text-sm">
                  <span>Protein Intake</span>
                  <span className="font-medium">{healthMetrics.proteinIntake} / 75 g</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Progress value={(healthMetrics.proteinIntake / 75) * 100} className="h-2" />
                </motion.div>
              </div>

              <div className="space-y-2" onClick={() => setShowInputDialog('fiberIntake')}>
                <div className="flex justify-between text-sm">
                  <span>Fiber Intake</span>
                  <span className="font-medium">{healthMetrics.fiberIntake} / 30 g</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <Progress value={(healthMetrics.fiberIntake / 30) * 100} className="h-2" />
                </motion.div>
              </div>

              <div className="space-y-2" onClick={() => setShowInputDialog('screenTime')}>
                <div className="flex justify-between text-sm">
                  <span>Screen Time</span>
                  <span className="font-medium">{healthMetrics.screenTime} / 3 hrs</span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <Progress value={(healthMetrics.screenTime / 3) * 100} className="h-2" />
                </motion.div>
              </div>




            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full hover:bg-secondary/10 hover:text-secondary"
                onClick={handleUpdateGoals}
              >
                Update Goals
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <div className="space-y-4">
        <motion.h2 
          className="text-xl font-semibold bg-gradient-to-r from-primary/80 to-secondary/80 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Health Benefits
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {healthBenefits.map((benefit, index) => (
            <motion.div 
              key={benefit.title} 
              variants={item}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card variant="elevated" className="h-full transition-all">
                <CardHeader className="pb-2">
                  <motion.div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${benefit.color}`}
                    whileHover={{ rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <benefit.icon className="h-6 w-6" />
                  </motion.div>
                  <CardTitle className="text-lg mt-2">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{benefit.progress}%</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                    >
                      <Progress value={benefit.progress} className="h-2" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div 
        className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-medium mb-1">Get a personalized workout plan</h3>
            <p className="text-muted-foreground">Our AI trainer can create a custom plan based on your goals</p>
          </div>
          <Button asChild>
            <Link to="/ai-coach" className="bg-primary hover:bg-primary/90 text-white">
              Get Started
            </Link>
          </Button>
        </div>
      </motion.div>
      
      <Dialog open={!!showInputDialog} onOpenChange={(open) => !open && setShowInputDialog(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update {showInputDialog}</DialogTitle>
            <DialogDescription>
              Enter your new {showInputDialog} value below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Enter your ${showInputDialog}`}
                autoFocus
              />
              {showInputDialog === 'steps' && <span>steps</span>}
              {showInputDialog === 'heartRate' && <span>BPM</span>}
              {showInputDialog === 'o2Level' && <span>%</span>}
              {showInputDialog === 'activeMinutes' && <span>min</span>}
              {showInputDialog === 'water' && <span>glasses</span>}
              {showInputDialog === 'calories' && <span>cal</span>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowInputDialog(null)}>Cancel</Button>
            <Button onClick={handleUpdateData}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
