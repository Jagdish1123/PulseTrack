import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dumbbell, BrainCircuit, Send, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Types
type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

type WorkoutPlan = {
  title: string;
  summary: string;
  days: {
    name: string;
    focus: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
    }>;
    duration: string;
  }[];
  tips: string[];
  quote: string;
} | null;

const workoutFormSchema = z.object({
  goal: z.enum(["lose_weight", "build_muscle", "stay_fit", "improve_endurance"]),
  frequency: z.enum(["3", "5", "7"]),
  preferredTime: z.enum(["morning", "afternoon", "evening"]),
  workoutType: z.enum(["home", "gym", "yoga", "mixed"]),
  age: z.string().min(1, "Age is required").max(3, "Invalid age"),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

// Sample responses for mock AI
const sampleResponses = [
  "For weight loss, focus on a calorie deficit through both diet and exercise. Try incorporating 30 minutes of cardio 3-4 times a week.",
  "To build muscle, ensure you're getting enough protein (around 1.6-2.2g per kg of bodyweight) and focus on progressive overload in your strength training.",
  "HIIT workouts are excellent for burning calories in a short time. Try 30 seconds of intense work followed by 30 seconds of rest for 15-20 minutes.",
  "For recovery, make sure you're getting 7-9 hours of sleep and consider adding yoga or light stretching on rest days.",
  "Stay hydrated! Aim for at least 8 glasses of water daily, more if you're exercising intensely.",
  "For a pre-workout meal, try something with complex carbs and moderate protein about 1-2 hours before exercise.",
  "To improve running endurance, gradually increase your distance by no more than 10% each week."
];

const generateWorkoutPlan = (formData: z.infer<typeof workoutFormSchema>): WorkoutPlan => {
  const daysPerWeek = parseInt(formData.frequency);
  const workoutDays = Array.from({ length: daysPerWeek }, (_, i) => {
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const focuses = ['Full Body', 'Upper Body', 'Lower Body', 'Core', 'Cardio'];
    
    return {
      name: dayNames[i],
      focus: focuses[Math.floor(Math.random() * focuses.length)],
      exercises: [
        {
          name: 'Bodyweight Squats',
          sets: 3,
          reps: '15 reps'
        },
        {
          name: 'Push-ups',
          sets: 3,
          reps: '10 reps'
        },
        {
          name: 'Plank',
          sets: 3,
          reps: '30 seconds'
        }
      ],
      duration: '30 minutes'
    };
  });

  return {
    title: `${formData.goal.replace('_', ' ').toUpperCase()} - Your ${daysPerWeek}-Day Transformation Plan`,
    summary: `Custom plan for a ${formData.age}-year-old ${formData.fitnessLevel} focusing on ${formData.goal.replace('_', ' ')} with ${formData.workoutType} workouts in the ${formData.preferredTime}.`,
    days: workoutDays,
    tips: [
      "Stay consistent with your workout schedule",
      "Keep yourself hydrated throughout the day"
    ],
    quote: "The only bad workout is the one that didn't happen."
  };
};

const AICoach = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI Fitness Coach. How can I help with your workout or nutrition questions today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof workoutFormSchema>>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: {
      goal: "lose_weight",
      frequency: "3",
      preferredTime: "morning",
      workoutType: "home",
      age: "",
      fitnessLevel: "beginner",
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!inputMessage.trim()) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
  
    // Mapping keywords to responses
    const keywordMap: Record<string, string> = {
      weight: "For weight loss, focus on a calorie deficit through both diet and exercise. Try incorporating 30 minutes of cardio 3-4 times a week.",
      muscle: "To build muscle, ensure you're getting enough protein (around 1.6-2.2g per kg of bodyweight) and focus on progressive overload in your strength training.",
      hiit: "HIIT workouts are excellent for burning calories in a short time. Try 30 seconds of intense work followed by 30 seconds of rest for 15-20 minutes.",
      recovery: "For recovery, make sure you're getting 7-9 hours of sleep and consider adding yoga or light stretching on rest days.",
      hydration: "Stay hydrated! Aim for at least 8 glasses of water daily, more if you're exercising intensely.",
      preworkout: "For a pre-workout meal, try something with complex carbs and moderate protein about 1-2 hours before exercise.",
      running: "To improve running endurance, gradually increase your distance by no more than 10% each week."
    };
  
    setTimeout(() => {
      const userInput = inputMessage.toLowerCase();
      const matchedKey = Object.keys(keywordMap).find(key => userInput.includes(key));
      const response = matchedKey
        ? keywordMap[matchedKey]
        : sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
  
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };
  
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      toast.info("New fitness tip received!");
    }, 1500);
  };
  

  const onWorkoutFormSubmit = (data: z.infer<typeof workoutFormSchema>) => {
    const plan = generateWorkoutPlan(data);
    setWorkoutPlan(plan);
    toast.success("Workout plan generated successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold">AI Fitness Coach</h1>
        <Button onClick={() => setShowWorkoutForm(true)} className="bg-primary">
          Generate Workout Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                Chat with your AI Coach
              </CardTitle>
              <CardDescription>
                Ask questions about workouts, nutrition, or fitness goals
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col overflow-hidden">
              <div className="flex-grow overflow-y-auto pr-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-8 w-8">
                        {message.sender === 'ai' ? (
                          <>
                            <AvatarImage src="/bot-avatar.png" />
                            <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/user-avatar.png" />
                            <AvatarFallback>U</AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-3 bg-muted">
                        <div className="flex gap-1">
                          <span className="animate-bounce">•</span>
                          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>•</span>
                          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>•</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <Input
                  placeholder="Ask a fitness question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                onClick={() => {
                  setInputMessage("How can I lose weight effectively?");
                }}
              >
                <Dumbbell className="mr-2 h-4 w-4" />
                Weight loss tips
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                onClick={() => {
                  setInputMessage("What's the best diet for muscle gain?");
                }}
              >
                <Dumbbell className="mr-2 h-4 w-4" />
                Muscle building nutrition
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                onClick={() => {
                  setInputMessage("Recommend a HIIT workout routine");
                }}
              >
                <Dumbbell className="mr-2 h-4 w-4" />
                HIIT workout ideas
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                onClick={() => {
                  setInputMessage("How to improve recovery between workouts?");
                }}
              >
                <Dumbbell className="mr-2 h-4 w-4" />
                Recovery strategies
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Coach Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Try asking specific questions about your routine</p>
              <p>• Include your fitness goals for personalized advice</p>
              <p>• Ask about nutrition, recovery, or workout plans</p>
              <p>• The coach can suggest exercises for specific muscle groups</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showWorkoutForm} onOpenChange={setShowWorkoutForm}>
        <DialogContent className="sm:max-w-[500px] fixed top-5 right-5">
          <DialogHeader>
            <DialogTitle>Generate Your Personalized Workout Plan</DialogTitle>
            <DialogDescription>
              Fill in your preferences and goals to get a customized 7-day workout plan.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onWorkoutFormSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Goal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lose_weight">Lose Weight</SelectItem>
                        <SelectItem value="build_muscle">Build Muscle</SelectItem>
                        <SelectItem value="stay_fit">Stay Fit</SelectItem>
                        <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workout Frequency (days per week)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="5">5 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferredTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workoutType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="gym">Gym</SelectItem>
                          <SelectItem value="yoga">Yoga</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fitnessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fitness Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Generate Plan</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!workoutPlan} onOpenChange={() => setWorkoutPlan(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto fixed top-5 left-5">
          <DialogHeader>
            <DialogTitle>{workoutPlan?.title}</DialogTitle>
            <DialogDescription>{workoutPlan?.summary}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {workoutPlan?.days.map((day, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {day.name} - {day.focus}
                  </CardTitle>
                  <CardDescription>Duration: {day.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {day.exercises.map((exercise, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-primary" />
                        {exercise.name} - {exercise.sets} sets × {exercise.reps}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">AI Coach Tips:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {workoutPlan?.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Remember:</h3>
                <blockquote className="border-l-2 border-primary pl-4 italic">
                  {workoutPlan?.quote}
                </blockquote>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AICoach;
