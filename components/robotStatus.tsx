"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar } from "recharts";
import {
  FastForward,
  ArrowBigRight,
  ArrowBigLeft,
  ArrowBigLeftDash,
} from "lucide-react";

const speedData = [
  { name: "T1", value: 1.2 },
  { name: "T2", value: 2.3 },
  { name: "T3", value: 1.8 },
];

const tempData = [
  { name: "T1", value: 36 },
  { name: "T2", value: 37.2 },
  { name: "T3", value: 35.8 },
];

const logs = [
  { time: "12:00", message: "Robot powered on." },
  { time: "12:05", message: "Moved forward 5m." },
  { time: "12:10", message: "Obstacle detected." },
];

export default function RobotStatusDashboard() {
  return (
    <Tabs defaultValue="overview" className="w-full m-4 px-4 pr-10">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="controls">Controls</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>

      {/* Overview */}
      <TabsContent value="overview">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Battery Level
              </span>
              <Badge variant="outline">Normal</Badge>
            </CardHeader>
            <CardContent>
              <Progress value={76} className="h-2 bg-muted" />
              <p className="text-sm mt-2 text-muted-foreground">76% Charged</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Speed (m/s)</CardHeader>
            <CardContent>
              <LineChart width={300} height={100} data={speedData}>
                <Line type="monotone" dataKey="value" stroke="#f43f5e" />
              </LineChart>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Temperature (°C)</CardHeader>
            <CardContent>
              <BarChart width={300} height={100} data={tempData}>
                <Bar dataKey="value" fill="#f43f5e" />
              </BarChart>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Controls */}
      <TabsContent value="controls">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>Power</CardHeader>
            <CardContent className="flex items-center justify-between">
              <span>Robot Power</span>
              <Switch defaultChecked />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Speed Control</CardHeader>
            <CardContent>
              <Slider defaultValue={[50]} max={100} step={1} />
              <p className="text-sm text-muted-foreground mt-2">
                Adjust robot speed
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>Movement</CardHeader>
            <CardContent className="flex gap-4 flex-wrap">
              <Button variant="outline">
                <FastForward /> Forward
              </Button>
              <Button variant="outline">
                <ArrowBigLeft /> Left
              </Button>
              <Button variant="outline">
                <ArrowBigRight />
                Right
              </Button>
              <Button variant="outline">
                <ArrowBigLeftDash />
                Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Logs */}
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
