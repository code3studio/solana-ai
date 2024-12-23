"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Award, Loader2, Trophy, Clock } from "lucide-react";
import { Task } from "@/types/challenge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const TaskDashboard = () => {
  const [task, setTask] = useState<Task[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timers, setTimers] = useState<{
    [key: string]: { hours: number; minutes: number; seconds: number };
  }>({});

  useEffect(() => {
    fetchActiveTask();
    const interval = setInterval(fetchActiveTask, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!task) return;

    const intervalId = setInterval(() => {
      const newTimers: {
        [key: string]: { hours: number; minutes: number; seconds: number };
      } = {};

      task.forEach((t) => {
        const endTime = new Date(t.endTime).getTime();
        const now = new Date().getTime();
        const timeLeft = endTime - now;
        const hours = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        newTimers[t._id] = { hours, minutes, seconds };
      });

      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [task]);

  const fetchActiveTask = async () => {
    try {
      const response = await fetch("/api/tasks/active");
      if (response.ok) {
        const data = await response.json();
        setTask(data.task);
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading task...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!task || task.length === 0) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <span>No active tasks found.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 p-6">
      {task.map((t) => (
        <Card
          key={t._id}
          className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 pb-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-white/90 dark:bg-gray-800">
                Active Challenge
              </Badge>
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <CardTitle className="text-xl mb-2">{t.title}</CardTitle>
            <CardDescription className="text-sm text-gray-600 mb-4">
              {t.description}
            </CardDescription>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <Award className="h-5 w-5" />
                <span className="font-medium">
                  Reward: {t.rewards.usdcAmount} USDC
                </span>
              </div>

              <div className="flex items-center space-x-2 text-blue-600">
                <Clock className="h-5 w-5" />
                <span className="font-medium">
                  {timers[t._id]
                    ? `${timers[t._id].hours}h ${timers[t._id].minutes}m ${
                        timers[t._id].seconds
                      }s`
                    : "Calculating..."}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link href={`/tasks/${t._id}`} className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                  Start Challenge
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskDashboard;
