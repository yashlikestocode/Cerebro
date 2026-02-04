"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
} from "lucide-react";

const COLORS = {
  completed: "#22c55e",
  skipped: "#ef4444",
  pending: "#a855f7",
  accent: "#06b6d4",
};

export function Analytics() {
  const { plan } = useAppStore();

  const stats = useMemo(() => {
    if (!plan) return null;

    const completed = plan.tasks.filter((t) => t.status === "completed").length;
    const skipped = plan.tasks.filter((t) => t.status === "skipped").length;
    const pending = plan.tasks.filter((t) => t.status === "pending").length;
    const total = plan.tasks.length;

    const completedMinutes = plan.tasks
      .filter((t) => t.status === "completed")
      .reduce((acc, t) => acc + t.duration, 0);

    // Weekly data
    const weeklyData: { week: string; completed: number; skipped: number }[] = [];
    const tasksByWeek: Record<string, { completed: number; skipped: number }> = {};

    plan.tasks.forEach((task) => {
      const date = new Date(task.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!tasksByWeek[weekKey]) {
        tasksByWeek[weekKey] = { completed: 0, skipped: 0 };
      }

      if (task.status === "completed") {
        tasksByWeek[weekKey].completed++;
      } else if (task.status === "skipped") {
        tasksByWeek[weekKey].skipped++;
      }
    });

    Object.entries(tasksByWeek)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([week, data]) => {
        const date = new Date(week);
        weeklyData.push({
          week: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          ...data,
        });
      });

    // Subject distribution
    const subjectData = plan.subjects.map((subject) => {
      const subjectTasks = plan.tasks.filter((t) => t.subject === subject.name);
      const completedTasks = subjectTasks.filter((t) => t.status === "completed");
      return {
        name: subject.name,
        value: completedTasks.length,
        total: subjectTasks.length,
        color: subject.color,
      };
    });

    // Daily study time trend
    const dailyData: { date: string; minutes: number }[] = [];
    const tasksByDate: Record<string, number> = {};

    plan.tasks
      .filter((t) => t.status === "completed")
      .forEach((task) => {
        if (!tasksByDate[task.date]) {
          tasksByDate[task.date] = 0;
        }
        tasksByDate[task.date] += task.duration;
      });

    Object.entries(tasksByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .forEach(([date, minutes]) => {
        dailyData.push({
          date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
          minutes,
        });
      });

    return {
      completed,
      skipped,
      pending,
      total,
      completedMinutes,
      weeklyData,
      subjectData,
      dailyData,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [plan]);

  if (!plan || !stats) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">No Data Yet</h3>
          <p className="text-center text-muted-foreground">
            Create a study plan and start completing tasks to see your analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="mt-1 text-muted-foreground">
          Track your study progress and identify areas for improvement.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.completionRate}%</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <XCircle className="h-4 w-4 text-destructive" />
              Skipped
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.skipped}</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4" />
              Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {Math.floor(stats.completedMinutes / 60)}h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Progress */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-300px">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completed" fill={COLORS.completed} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="skipped" fill={COLORS.skipped} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Subject Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stats.subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string, props: { payload: { total: number } }) => [
                      `${value}/${props.payload.total} completed`,
                      name,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Study Time Trend */}
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Daily Study Time (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-300px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value} min`, "Study Time"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke={COLORS.accent}
                    strokeWidth={2}
                    dot={{ fill: COLORS.accent, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
