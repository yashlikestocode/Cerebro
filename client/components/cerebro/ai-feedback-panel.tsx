"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Brain, Info, Lightbulb, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const feedbackIcons = {
  info: Info,
  suggestion: Lightbulb,
  warning: AlertTriangle,
  success: CheckCircle2,
};

const feedbackStyles = {
  info: "border-accent/30 bg-accent/5",
  suggestion: "border-primary/30 bg-primary/5",
  warning: "border-warning/30 bg-warning/5",
  success: "border-success/30 bg-success/5",
};

const iconStyles = {
  info: "text-accent",
  suggestion: "text-primary",
  warning: "text-warning",
  success: "text-success",
};

interface AIFeedbackPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIFeedbackPanel({ isOpen, onClose }: AIFeedbackPanelProps) {
  const { aiFeedback, clearFeedback } = useAppStore();

  if (!isOpen || aiFeedback.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <div className="rounded-2xl border border-border bg-card/95 backdrop-blur-sm shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground">AI Insights</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Messages */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-2">
          {aiFeedback.slice(0, 5).map((feedback) => {
            const Icon = feedbackIcons[feedback.type];
            return (
              <div
                key={feedback.id}
                className={cn(
                  "rounded-xl border p-3 transition-all duration-300 animate-in fade-in slide-in-from-right-5",
                  feedbackStyles[feedback.type]
                )}
              >
                <div className="flex gap-3">
                  <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconStyles[feedback.type])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-card-foreground leading-relaxed">
                      {feedback.message}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatTimeAgo(feedback.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
