"use client";
import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Award, Loader2, CheckCircle2 } from "lucide-react";
import { Task } from "@/types/challenge";
import { Badge } from "@/components/ui/badge";

const PastTask = () => {
    const [tasks, setTasks] = useState<Task[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPastTasks();
    }, []);

    const fetchPastTasks = async () => {
        try {
            const response = await fetch("/api/tasks/past");
            if (response.ok) {
                const data = await response.json();
                setTasks(data.checkTaskStatus);
            }
        } catch (error) {
            console.error("Error fetching past tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <Card className="max-w-4xl mx-auto mt-8">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <span>No past tasks found.</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 p-6">
            {tasks.map((task) => (
                <Card
                    key={task._id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                    <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10 pb-4">
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="bg-white/90 dark:bg-gray-800">
                                Completed
                            </Badge>
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <CardTitle className="text-xl mb-2">{task.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-600 mb-4">
                            {task.description}
                        </CardDescription>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 text-green-600">
                                <Award className="h-5 w-5" />
                                <span className="font-medium">
                                    Earned: {task.rewards.usdcAmount} USDC
                                </span>
                            </div>

                            <div className="text-sm text-gray-500">
                                Completed on: {new Date(task.endTime).toLocaleDateString()}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default PastTask;
