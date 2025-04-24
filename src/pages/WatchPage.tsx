import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Clock, Footprints, LineChart, Timer, RefreshCw, Zap } from 'lucide-react';
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const generateMockData = () => {
  const heartRateData = [];
  const oxygenData = [];
  const stepsData = [];
  
  for (let i = 0; i < 24; i++) {
    const time = i.toString().padStart(2, '0') + ':00';
    
    const baseHeartRate = 65;
    const heartRateVariation = Math.sin(i / 3) * 10;
    const heartRate = Math.round(baseHeartRate + heartRateVariation + Math.random() * 5);
    
    const baseOxygen = 95;
    const oxygenLevel = Math.round((baseOxygen + Math.random() * 4) * 10) / 10;
    
    let steps = 0;
    if (i >= 8 && i <= 22) {
      if ((i >= 12 && i <= 14) || (i >= 17 && i <= 19)) {
        steps = Math.round(800 + Math.random() * 600);
      } else {
        steps = Math.round(300 + Math.random() * 300);
      }
    } else {
      steps = Math.round(Math.random() * 50);
    }
    
    heartRateData.push({ time, value: heartRate });
    oxygenData.push({ time, value: oxygenLevel });
    stepsData.push({ time, value: steps });
  }
  
  return {
    heartRate: heartRateData,
    oxygen: oxygenData,
    steps: stepsData
  };
};

const WatchPage = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [activeMetric, setActiveMetric] = useState('heartRate');
  const [syncProgress, setSyncProgress] = useState(0);
  const [metrics, setMetrics] = useState({
    heartRate: 0,
    oxygenLevel: 0,
    steps: 0,
    activeMinutes: 0,
  });
  const [historicalData, setHistoricalData] = useState(generateMockData());

  useEffect(() => {
    if (!connected && !lastSynced) {
      const timer = setTimeout(() => {
        connectWatch();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [connected, lastSynced]);

  const connectWatch = () => {
    setLoading(true);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSyncProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setConnected(true);
        setLoading(false);
        setLastSynced(new Date());
        
        setMetrics({
          heartRate: Math.floor(70 + Math.random() * 10),
          oxygenLevel: Math.floor(96 + Math.random() * 3 * 10) / 10,
          steps: Math.floor(7000 + Math.random() * 3000),
          activeMinutes: Math.floor(30 + Math.random() * 30),
        });
      }
    }, 500);
  };

  const disconnectWatch = () => {
    setConnected(false);
    setSyncProgress(0);
  };

  const refreshData = () => {
    setLoading(true);
    setSyncProgress(0);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setSyncProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setLoading(false);
        setLastSynced(new Date());
        
        setMetrics({
          heartRate: Math.floor(70 + Math.random() * 10),
          oxygenLevel: Math.floor(96 + Math.random() * 3 * 10) / 10,
          steps: Math.floor(7000 + Math.random() * 3000),
          activeMinutes: Math.floor(30 + Math.random() * 30),
        });
        
        setHistoricalData(generateMockData());
      }
    }, 500);
  };

  const getHeartRateColor = (rate: number) => {
    if (rate < 60) return 'text-blue-500';
    if (rate > 100) return 'text-red-500';
    return 'text-green-500';
  };

  const getOxygenColor = (level: number) => {
    if (level < 95) return 'text-red-500';
    if (level < 97) return 'text-amber-500';
    return 'text-green-500';
  };

  const getChartColor = (metric: string) => {
    switch (metric) {
      case 'heartRate': return '#ef4444';
      case 'oxygen': return '#3b82f6';
      case 'steps': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getChartData = () => {
    switch (activeMetric) {
      case 'heartRate': return historicalData.heartRate;
      case 'oxygen': return historicalData.oxygen;
      case 'steps': return historicalData.steps;
      default: return [];
    }
  };

  const formatYAxisLabel = (value: number, index: number): string => {
    switch (activeMetric) {
      case 'heartRate': return `${value} bpm`;
      case 'oxygen': return `${value}%`;
      case 'steps': return value.toString();
      default: return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Watch Integration</h1>
          <p className="text-muted-foreground">Connect and sync with your fitness watch</p>
        </div>
        
        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={disconnectWatch}
                disabled={loading}
              >
                Disconnect
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Sync
              </Button>
            </>
          ) : (
            <Button 
              onClick={connectWatch}
              disabled={loading}
            >
              Connect Watch
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <Card>
          <CardContent className="py-6">
            <div className="space-y-3 text-center">
              <div className="flex justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
              <h3 className="font-medium text-lg">Syncing with watch...</h3>
              <Progress value={syncProgress} className="max-w-md mx-auto" />
              <p className="text-sm text-muted-foreground">{syncProgress}% complete</p>
            </div>
          </CardContent>
        </Card>
      )}

      {connected && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Health Metrics</CardTitle>
                <CardDescription>
                  {lastSynced && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Last synced: {lastSynced.toLocaleTimeString()}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-none bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm text-muted-foreground">Heart Rate</div>
                          <div className={`text-2xl font-semibold ${getHeartRateColor(metrics.heartRate)}`}>
                            {metrics.heartRate} <span className="text-xs font-normal">BPM</span>
                          </div>
                        </div>
                        <Heart className="h-5 w-5 text-health-heartRate" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none bg-blue-500/5">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm text-muted-foreground">Oxygen Level</div>
                          <div className={`text-2xl font-semibold ${getOxygenColor(metrics.oxygenLevel)}`}>
                            {metrics.oxygenLevel}%
                          </div>
                        </div>
                        <Activity className="h-5 w-5 text-health-o2Level" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none bg-amber-500/5">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm text-muted-foreground">Steps</div>
                          <div className="text-2xl font-semibold text-health-stepCount">
                            {metrics.steps.toLocaleString()}
                          </div>
                        </div>
                        <Footprints className="h-5 w-5 text-health-stepCount" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none bg-green-500/5">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm text-muted-foreground">Active Minutes</div>
                          <div className="text-2xl font-semibold text-health-activeMinutes">
                            {metrics.activeMinutes}
                          </div>
                        </div>
                        <Timer className="h-5 w-5 text-health-activeMinutes" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <div className="text-sm font-medium mb-1">Daily Step Goal</div>
                    <div className="flex items-center gap-2">
                      <Progress value={(metrics.steps / 10000) * 100} className="h-2" />
                      <span className="text-sm whitespace-nowrap">{metrics.steps} / 10,000</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Calories</div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">{Math.round(metrics.steps * 0.04)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>Connected watch details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">PulseTrack Watch</h4>
                    <p className="text-sm text-muted-foreground">Connected via Bluetooth</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-green-50">
                        Battery: 85%
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-blue-50">
                        Firmware: v2.3
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Device ID</span>
                    <span>PT-283A7F</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Full Sync</span>
                    <span>Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Storage</span>
                    <span>14 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sensors</span>
                    <span>Heart, SpO2, Accelerometer, Gyro</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Device Settings</Button>
                <Button variant="outline" size="sm">Update Firmware</Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" /> Health Trends
              </CardTitle>
              <CardDescription>View your daily metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeMetric} onValueChange={setActiveMetric} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="heartRate" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" /> Heart Rate
                  </TabsTrigger>
                  <TabsTrigger value="oxygen" className="flex items-center gap-1">
                    <Activity className="h-4 w-4" /> Oxygen Level
                  </TabsTrigger>
                  <TabsTrigger value="steps" className="flex items-center gap-1">
                    <Footprints className="h-4 w-4" /> Steps
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={activeMetric} className="h-[300px] mt-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={getChartData()} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="time" />
                      <YAxis 
                        tickFormatter={formatYAxisLabel} 
                        domain={activeMetric === 'heartRate' ? ['dataMin - 10', 'dataMax + 10'] : 
                               activeMetric === 'oxygen' ? [90, 100] : ['dataMin', 'dataMax + 100']}
                      />
                      <Tooltip 
                        formatter={(value) => [
                          activeMetric === 'heartRate' ? `${value} bpm` :
                          activeMetric === 'oxygen' ? `${value}%` : 
                          value
                        ]}
                      />
                      <Line 
                        type="monotone"
                        dataKey="value" 
                        stroke={getChartColor(activeMetric)} 
                        strokeWidth={2} 
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {!connected && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Connect Your Fitness Watch</CardTitle>
              <CardDescription>Sync your health data to track your progress</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Activity className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center max-w-md mb-6">
                <h3 className="text-lg font-medium mb-2">Get more insights from your wearable</h3>
                <p className="text-muted-foreground">
                  Connect your fitness watch to track heart rate, oxygen levels, steps, and more in real-time.
                </p>
              </div>
              <Button onClick={connectWatch} size="lg">Connect Watch</Button>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground">
              <p className="mx-auto">Compatible with most popular fitness watches and trackers</p>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default WatchPage;
