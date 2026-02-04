"use client";

import { cn } from "@/lib/utils";
import type { View } from "@/src/App";
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  BarChart3,
  Brain,
  Sparkles,
  LogOut,
  User,
  CalendarCheck,
} from "lucide-react";

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onToggleAI: () => void;
  onLogout?: () => void;
  userEmail?: string;
}

const navItems = [
  { id: "dashboard" as const, label: "AI Assistant", icon: LayoutDashboard },
  { id: "task-scheduler" as const, label: "Task Scheduler", icon: CalendarCheck },
  { id: "study-plan" as const, label: "Study Plan", icon: Calendar },
  { id: "create-plan" as const, label: "Create Plan", icon: PlusCircle },
  { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
];

export function Sidebar({ currentView, onNavigate, onToggleAI, onLogout, userEmail }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-bold tracking-tight text-sidebar-foreground">
            CEREBRO
          </span>
          <Sparkles className="h-3.5 w-3.5 text-accent" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* AI Status */}
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={onToggleAI}
          className="w-full rounded-xl bg-primary/10 p-4 text-left transition-colors hover:bg-primary/20"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            <span className="text-xs font-medium text-accent">AI Active</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Continuously optimizing your study plan based on your progress.
          </p>
        </button>
      </div>

      {/* User Section */}
      {userEmail && (
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {userEmail}
              </p>
              <p className="text-xs text-muted-foreground">Student</p>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-transparent py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
