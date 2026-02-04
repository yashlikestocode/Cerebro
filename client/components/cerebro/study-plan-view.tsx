"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { TaskCard } from "./task-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  List,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudyTask } from "@/lib/types";
import type { View } from "@/src/App";

interface StudyPlanViewProps {
  onNavigate: (view: View) => void;
}

export function StudyPlanView({ onNavigate }: StudyPlanViewProps) {
  const { plan } = useAppStore();
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const weekDays = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + currentWeekOffset * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, [currentWeekOffset]);

  const tasksByDate = useMemo(() => {
    if (!plan) return {};
    return plan.tasks.reduce(
      (acc, task) => {
        if (!acc[task.date]) acc[task.date] = [];
        acc[task.date].push(task);
        return acc;
      },
      {} as Record<string, StudyTask[]>
    );
  }, [plan]);

  if (!plan) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">No Study Plan</h3>
          <p className="mb-4 text-center text-muted-foreground">
            Create a study plan to start tracking your progress.
          </p>
          <Button
            onClick={() => onNavigate("create-plan")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{plan.name}</h1>
          <p className="mt-1 text-muted-foreground">
            Exam date:{" "}
            {new Date(plan.examDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "calendar")}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Subjects Overview */}
      <div className="flex flex-wrap gap-3">
        {plan.subjects.map((subject) => (
          <div
            key={subject.id}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: subject.color }}
            />
            <span className="text-sm font-medium text-card-foreground">{subject.name}</span>
            <span className="text-xs text-muted-foreground">{subject.totalHours}h</span>
          </div>
        ))}
      </div>

      {viewMode === "calendar" ? (
        <div className="space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeekOffset((prev) => prev - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-foreground">
              {weekDays[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
              {weekDays[6].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeekOffset((prev) => prev + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date) => {
              const dateStr = date.toISOString().split("T")[0];
              const dayTasks = tasksByDate[dateStr] || [];
              const isToday = dateStr === today;
              const isPast = dateStr < today;

              return (
                <Card
                  key={dateStr}
                  className={cn(
                    "min-h-[200px] border-border bg-card transition-colors",
                    isToday && "border-primary/50 bg-primary/5"
                  )}
                >
                  <CardHeader className="p-3 pb-2">
                    <CardTitle
                      className={cn(
                        "text-center text-xs font-medium",
                        isToday ? "text-primary" : isPast ? "text-muted-foreground" : "text-foreground"
                      )}
                    >
                      <span className="block text-[10px] uppercase">
                        {date.toLocaleDateString("en-US", { weekday: "short" })}
                      </span>
                      <span
                        className={cn(
                          "mt-1 flex h-7 w-7 mx-auto items-center justify-center rounded-full text-sm",
                          isToday && "bg-primary text-primary-foreground"
                        )}
                      >
                        {date.getDate()}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1.5 p-2 pt-0">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "rounded-md px-2 py-1 text-[10px] font-medium truncate",
                          task.status === "completed" && "bg-success/20 text-success line-through",
                          task.status === "skipped" && "bg-destructive/20 text-destructive",
                          task.status === "pending" && "bg-primary/20 text-primary"
                        )}
                      >
                        {task.topic}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <p className="text-center text-[10px] text-muted-foreground">
                        +{dayTasks.length - 3} more
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Group tasks by date */}
          {Object.entries(tasksByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .filter(([date]) => date >= today)
            .slice(0, 7)
            .map(([date, tasks]) => (
              <div key={date}>
                <h3
                  className={cn(
                    "mb-3 text-sm font-semibold",
                    date === today ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {date === today
                    ? "Today"
                    : new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
