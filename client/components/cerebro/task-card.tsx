"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { StudyTask } from "@/lib/types";
import { Check, Clock, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: StudyTask;
  showDate?: boolean;
}

const subjectColors: Record<string, string> = {
  Mathematics: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Physics: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Chemistry: "bg-green-500/20 text-green-400 border-green-500/30",
  Biology: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const priorityColors: Record<string, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/20 text-warning",
  high: "bg-destructive/20 text-destructive",
};

export function TaskCard({ task, showDate = false }: TaskCardProps) {
  const updateTaskStatus = useAppStore((state) => state.updateTaskStatus);

  const handleComplete = () => {
    updateTaskStatus(task.id, task.status === "completed" ? "pending" : "completed");
  };

  const handleSkip = () => {
    updateTaskStatus(task.id, task.status === "skipped" ? "pending" : "skipped");
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300",
        task.status === "completed" && "border-success/30 bg-success/5",
        task.status === "skipped" && "border-destructive/30 bg-destructive/5 opacity-60"
      )}
    >
      {/* Status indicator line */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1 transition-colors",
          task.status === "completed" && "bg-success",
          task.status === "skipped" && "bg-destructive",
          task.status === "pending" && "bg-primary"
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 pl-2">
          {/* Subject badge */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium",
                subjectColors[task.subject] || "bg-primary/20 text-primary border-primary/30"
              )}
            >
              {task.subject}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                priorityColors[task.priority]
              )}
            >
              {task.priority}
            </span>
          </div>

          {/* Topic */}
          <h4
            className={cn(
              "mb-2 font-medium text-card-foreground transition-colors",
              task.status === "completed" && "line-through text-muted-foreground"
            )}
          >
            {task.topic}
          </h4>

          {/* Duration and date */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {task.duration} min
            </span>
            {showDate && (
              <span>
                {new Date(task.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5">
          <Button
            size="icon"
            variant={task.status === "completed" ? "default" : "outline"}
            className={cn(
              "h-8 w-8 rounded-lg transition-all",
              task.status === "completed" && "bg-success hover:bg-success/90 text-success-foreground"
            )}
            onClick={handleComplete}
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">
              {task.status === "completed" ? "Mark as pending" : "Mark as completed"}
            </span>
          </Button>
          <Button
            size="icon"
            variant={task.status === "skipped" ? "destructive" : "ghost"}
            className="h-8 w-8 rounded-lg"
            onClick={handleSkip}
          >
            <SkipForward className="h-4 w-4" />
            <span className="sr-only">
              {task.status === "skipped" ? "Mark as pending" : "Skip task"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
