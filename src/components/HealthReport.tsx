import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Activity, Download, FileText, Heart, Droplet, Dumbbell, Moon, Footprints } from "lucide-react";

interface HealthReportProps {
  user: any;
}

const HealthReport = ({ user }: HealthReportProps) => {
  // Mock data
  const weeklyData = [
    { day: "Mon", steps: 8235, sleep: 7.5, heartRate: 68, o2: 97, water: 2.5, workout: "Yoga" },
    { day: "Tue", steps: 10521, sleep: 6.8, heartRate: 72, o2: 98, water: 2.8, workout: "Strength" },
    { day: "Wed", steps: 7836, sleep: 7.2, heartRate: 70, o2: 97, water: 2.3, workout: "Cardio" },
    { day: "Thu", steps: 9284, sleep: 8.1, heartRate: 65, o2: 99, water: 3.0, workout: "Yoga" },
    { day: "Fri", steps: 12053, sleep: 6.5, heartRate: 75, o2: 98, water: 2.7, workout: "Strength" },
    { day: "Sat", steps: 5827, sleep: 8.5, heartRate: 62, o2: 98, water: 2.9, workout: "Rest" },
    { day: "Sun", steps: 4391, sleep: 9.2, heartRate: 60, o2: 99, water: 3.1, workout: "Rest" },
  ];

  const summary = {
    heartHealth: {
      avgBPM: 67,
      minBPM: 60,
      maxBPM: 75,
      trend: "Stable",
      note: "Great job maintaining a healthy heart rate!",
    },
    steps: {
      total: weeklyData.reduce((sum, day) => sum + day.steps, 0),
      highestDay: "Fri",
      streak: "3 days above 10k steps",
    },
    sleep: {
      avgHours: (weeklyData.reduce((sum, day) => sum + day.sleep, 0) / 7).toFixed(1),
      note: "You're meeting your sleep goals!",
    },
    hydration: {
      totalLiters: weeklyData.reduce((sum, day) => sum + day.water, 0),
      avgPerDay: (weeklyData.reduce((sum, day) => sum + day.water, 0) / 7).toFixed(1),
      note: "Great work staying hydrated!",
    },
    workouts: {
      totalSessions: weeklyData.filter((day) => day.workout !== "Rest").length,
      dominantType: "Yoga",
    },
    oxygen: {
      avgO2: 98,
      note: "Your oxygen levels are within a healthy range.",
    },
    tips: [
      "Try to maintain at least 7.5 hrs of sleep — your average is 7.2 this week.",
      "Great work hitting your hydration goal 5/7 days!",
    ],
    motivation: "Small steps every day lead to big results. Keep pushing!",
  };

  const downloadReport = () => {
    const reportJSON = JSON.stringify(summary, null, 2);
    const blob = new Blob([reportJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "health_report.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full hover:bg-primary/10 hover:text-primary group"
        >
          <span>View Health Report</span>
          <Activity className="ml-2 h-4 w-4 group-hover:text-primary transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto fixed top-5 right-0 -translate-x-0 translate-y-0">
        <DialogHeader>
          <DialogTitle className="text-2xl">Your Health Summary (Apr 14 – Apr 21)</DialogTitle>
          <DialogDescription>
            Detailed health metrics for {user?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" /> Heart Health
            </h3>
            <p>Average BPM: {summary.heartHealth.avgBPM}</p>
            <p>Min/Max BPM: {summary.heartHealth.minBPM}/{summary.heartHealth.maxBPM}</p>
            <p>Trend: {summary.heartHealth.trend}</p>
            <p>{summary.heartHealth.note}</p>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Footprints className="h-5 w-5 text-blue-500 mr-2" /> Steps
            </h3>
            <p>Total Steps: {summary.steps.total}</p>
            <p>Highest Day: {summary.steps.highestDay}</p>
            <p>Streak: {summary.steps.streak}</p>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Moon className="h-5 w-5 text-purple-500 mr-2" /> Sleep
            </h3>
            <p>Average Hours: {summary.sleep.avgHours}</p>
            <p>{summary.sleep.note}</p>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Droplet className="h-5 w-5 text-blue-400 mr-2" /> Hydration
            </h3>
            <p>Total Liters: {summary.hydration.totalLiters}</p>
            <p>Average Per Day: {summary.hydration.avgPerDay}L</p>
            <p>{summary.hydration.note}</p>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Dumbbell className="h-5 w-5 text-green-500 mr-2" /> Workout
            </h3>
            <p>Total Sessions: {summary.workouts.totalSessions}</p>
            <p>Dominant Type: {summary.workouts.dominantType}</p>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Droplet className="h-5 w-5 text-gray-500 mr-2" /> Oxygen Level
            </h3>
            <p>Average O₂ Level: {summary.oxygen.avgO2}%</p>
            <p>{summary.oxygen.note}</p>
          </div>

          <div className="bg-card border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">💡 AI Smart Tips</h3>
            <ul className="list-disc pl-5">
              {summary.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center text-sm text-muted-foreground">
            <FileText className="h-4 w-4 mr-2" />
            <span>{summary.motivation}</span>
          </div>
        </div>

        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={downloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HealthReport;