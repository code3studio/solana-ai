"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Clock, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Task } from "@/types/challenge";

const TaskById = ({ params }: { params: { id: string } }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/active/${params.id}`);
        if (!response.ok) throw new Error("Task not found");
        const data = await response.json();
        setTask(data.task);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [params.id]);

  useEffect(() => {
    if (!task) return;

    const timer = setInterval(() => {
      const endTime = new Date(task.endTime).getTime();
      const now = new Date().getTime();
      const timeLeft = endTime - now;

      setTimeLeft({
        hours: Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [task]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <Card className="max-w-4xl mx-auto mt-8">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500">{error || "Task not found"}</p>
            <Link href="/" className="mt-4 inline-block">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <Card className="bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <CardHeader>
          <CardTitle className="text-2xl">{task.title}</CardTitle>
          <CardDescription>{task.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2 text-green-600">
            <Award className="h-5 w-5" />
            <span className="font-medium">
              Reward: {task.rewards.usdcAmount} USDC
            </span>
          </div>

          <div className="flex items-center space-x-2 text-blue-600">
            <Clock className="h-5 w-5" />
            <span className="font-medium">
              {timeLeft
                ? `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
                : "Calculating..."}
            </span>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Task Requirements:</h3>
            <ul className="list-disc list-inside space-y-2">
              {task.requirements?.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Start Challenge
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskById;
