"use client";

import { useAppStore } from "@/lib/store";
import { ProgressRing } from "./progress-ring";
import { TaskCard } from "./task-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Target, TrendingUp, Clock, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { View } from "@/src/App";

interface TaskSchedulerProps {
  onNavigate: (view: View) => void;
}

export function TaskScheduler({ onNavigate }: TaskSchedulerProps) {
  const { plan, streak } = useAppStore();

  if (!plan) {
    return <TaskSchedulerSkeleton />;
  }

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = plan.tasks.filter((task) => task.date === today);
  const completedToday = todayTasks.filter((t) => t.status === "completed").length;
  const totalToday = todayTasks.length;
  const progress = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const totalStudyMinutesToday = todayTasks
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + t.duration, 0);

  const upcomingTasks = plan.tasks
    .filter((t) => t.date >= today && t.status === "pending")
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Good {getTimeOfDay()}, Learner
        </h1>
        <p className="mt-1 text-muted-foreground">
          {todayTasks.length > 0
            ? `You have ${totalToday - completedToday} tasks remaining today.`
            : "No tasks scheduled for today. Time to create a plan!"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Progress Card */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Target className="h-4 w-4" />
              Today&apos;s Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-4">
            <ProgressRing progress={progress} size={140} strokeWidth={10} />
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{streak}</span>
              <span className="text-lg text-muted-foreground">days</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Keep it up! You&apos;re on fire.
            </p>
          </CardContent>
        </Card>

        {/* Study Time Card */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Study Time Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">
                {Math.floor(totalStudyMinutesToday / 60)}
              </span>
              <span className="text-lg text-muted-foreground">hrs</span>
              <span className="text-2xl font-bold text-foreground">
                {totalStudyMinutesToday % 60}
              </span>
              <span className="text-lg text-muted-foreground">min</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Goal: {plan.dailyHours} hours per day
            </p>
          </CardContent>
        </Card>

        {/* Tasks Completed Card */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">{completedToday}</span>
              <span className="text-lg text-muted-foreground">/ {totalToday}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {completedToday === totalToday && totalToday > 0
                ? "All done! Great work!"
                : "Keep going, you got this!"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-foreground">Today&apos;s Tasks</h2>
        {todayTasks.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <Card className="border-border bg-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 rounded-full bg-secondary p-4">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mb-4 text-center text-muted-foreground">
                No tasks scheduled for today.
              </p>
              <Button
                onClick={() => onNavigate("create-plan")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create a Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">Upcoming</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {upcomingTasks.map((task) => (
              <TaskCard key={task.id} task={task} showDate />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskSchedulerSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-5 w-48" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border bg-card">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}