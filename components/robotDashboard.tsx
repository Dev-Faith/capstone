"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis } from "recharts";
import {
  FastForward,
  ArrowBigRight,
  ArrowBigLeft,
  ArrowBigLeftDash,
} from "lucide-react";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, off, set, push } from "firebase/database";

interface Status {
  battery: number;
  temperature: number;
  position: { x: number; y: number };
  speed: number;
  power: boolean;
}

interface Log {
  time: string;
  message: string;
}

export default function RobotDashboard() {
  const [status, setStatus] = useState<Status | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    const statusRef = ref(rtdb, "robot/status");
    const logsRef = ref(rtdb, "robot/logs");

    const statusListener = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStatus(data);
      }
    });

    const logsListener = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const logsArray = Object.values(data) as Log[];
        setLogs(logsArray.reverse());
      }
    });

    return () => {
      off(statusRef);
      off(logsRef);
    };
  }, []);

  const statusFieldsToUpdate: Record<string, boolean> = {
    power: true,
    speed: true,
  };

  const sendCommand = async (type: string, value: any) => {
    await set(ref(rtdb, `robot/commands/${type}`), value);

    const logRef = push(ref(rtdb, "robot/logs"));
    await set(logRef, {
      time: new Date().toLocaleTimeString(),
      message: `Sent command: ${type} - ${value}`,
    });

    if (statusFieldsToUpdate[type]) {
      await set(ref(rtdb, `robot/status/${type}`), value);
    }
  };

  const handlePowerToggle = (checked: boolean) => {
    setStatus((prev) => (prev ? { ...prev, power: checked } : prev));
    sendCommand("power", checked);
  };

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];

    // Optimistically update the status
    setStatus((prev) => (prev ? { ...prev, speed: newSpeed } : prev));

    // Send the command to the database
    sendCommand("speed", newSpeed);
  };

  const handleMovement = (direction: string) => {
    sendCommand("movement", direction);
  };

  // Early return while loading
  if (!status) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Loading robot status...</p>
      </div>
    );
  }

  const speedData = [{ name: "Now", value: status.speed }];
  const tempData = [{ name: "Now", value: status.temperature }];

  return (
    <Tabs defaultValue="overview" className="w-full m-4 px-4 pr-10">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="controls">Controls</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Battery Level
              </span>
              <Badge variant="outline">
                {status.battery > 20 ? "Normal" : "Low"}
              </Badge>
            </CardHeader>
            <CardContent>
              <Progress value={status.battery} className="h-2 bg-muted" />
              <p className="text-sm mt-2 text-muted-foreground">
                {status.battery}% Charged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Speed (m/s)</CardHeader>
            <CardContent>
              <LineChart width={300} height={100} data={speedData}>
                <Line type="monotone" dataKey="value" stroke="#f43f5e" />
                <XAxis dataKey="name" />
                <YAxis />
              </LineChart>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Temperature (°C)</CardHeader>
            <CardContent>
              <BarChart width={300} height={100} data={tempData}>
                <Bar dataKey="value" fill="#f43f5e" />
                <XAxis dataKey="name" />
                <YAxis />
              </BarChart>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Controls Tab */}
      <TabsContent value="controls">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>Power</CardHeader>
            <CardContent className="flex items-center justify-between">
              <span>Robot Power</span>
              <Switch
                checked={status.power}
                onCheckedChange={handlePowerToggle}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Speed Control</CardHeader>
            <CardContent>
              <Slider
                defaultValue={[status.speed]}
                max={5}
                step={0.1}
                onValueCommit={handleSpeedChange}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Adjust robot speed
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>Movement</CardHeader>
            <CardContent className="flex gap-4 flex-wrap">
              <Button
                variant="outline"
                onClick={() => handleMovement("forward")}
              >
                <FastForward className="mr-2" /> Forward
              </Button>
              <Button variant="outline" onClick={() => handleMovement("left")}>
                <ArrowBigLeft className="mr-2" /> Left
              </Button>
              <Button variant="outline" onClick={() => handleMovement("right")}>
                <ArrowBigRight className="mr-2" /> Right
              </Button>
              <Button
                variant="outline"
                onClick={() => handleMovement("backward")}
              >
                <ArrowBigLeftDash className="mr-2" /> Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Logs Tab */}
      <TabsContent value="logs">
        <Card className="h-[400px] overflow-hidden">
          <CardHeader>Activity Logs</CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="outline">{log.time}</Badge>
                    <div className="bg-muted p-3 rounded-lg w-full">
                      <p className="text-sm text-foreground">{log.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
