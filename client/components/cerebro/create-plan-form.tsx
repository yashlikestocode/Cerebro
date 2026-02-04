"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  CalendarIcon,
  Plus,
  X,
  Sparkles,
  BookOpen,
  Clock,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Subject, StudyTask, StudyPlan } from "@/lib/types";
import type { View } from "@/src/App";

const subjectColors = [
  "#a855f7",
  "#06b6d4",
  "#22c55e",
  "#eab308",
  "#f97316",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
];

interface CreatePlanFormProps {
  onNavigate: (view: View) => void;
}

export function CreatePlanForm({ onNavigate }: CreatePlanFormProps) {
  const { setPlan, addFeedback } = useAppStore();
  const [step, setStep] = useState(1);
  const [planName, setPlanName] = useState("");
  const [examDate, setExamDate] = useState<Date>();
  const [dailyHours, setDailyHours] = useState([3]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const addSubject = () => {
    if (newSubject.trim() && subjects.length < 8) {
      setSubjects([
        ...subjects,
        {
          id: String(Date.now()),
          name: newSubject.trim(),
          color: subjectColors[subjects.length % subjectColors.length],
          totalHours: Math.ceil(dailyHours[0] * 5),
        },
      ]);
      setNewSubject("");
    }
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const generatePlan = async () => {
    if (!examDate || subjects.length === 0) return;

    setIsGenerating(true);

    // Simulate AI generating plan
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const tasks: StudyTask[] = [];
    const today = new Date();
    const endDate = examDate;
    let taskId = 1;

    const topics: Record<string, string[]> = {
      Mathematics: ["Calculus", "Algebra", "Geometry", "Statistics", "Trigonometry"],
      Physics: ["Mechanics", "Thermodynamics", "Optics", "Electromagnetism"],
      Chemistry: ["Organic", "Inorganic", "Physical Chemistry", "Biochemistry"],
      Biology: ["Cell Biology", "Genetics", "Ecology", "Anatomy"],
      History: ["Ancient", "Medieval", "Modern", "World Wars"],
      Literature: ["Poetry Analysis", "Novel Study", "Drama", "Essays"],
      Computer: ["Algorithms", "Data Structures", "Programming", "Databases"],
    };

    // Generate tasks for each day
    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const tasksPerDay = Math.min(subjects.length, Math.ceil(dailyHours[0] / 1.5));

      subjects.slice(0, tasksPerDay).forEach((subject) => {
        const subjectTopics = topics[subject.name] || [
          "Chapter Review",
          "Practice Problems",
          "Summary Notes",
        ];
        const topic = subjectTopics[Math.floor(Math.random() * subjectTopics.length)];

        tasks.push({
          id: String(taskId++),
          subject: subject.name,
          topic,
          duration: [45, 60, 90][Math.floor(Math.random() * 3)],
          status: "pending",
          date: dateStr,
          priority: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as
            | "low"
            | "medium"
            | "high",
        });
      });
    }

    const newPlan: StudyPlan = {
      id: String(Date.now()),
      name: planName || "My Study Plan",
      examDate: examDate.toISOString().split("T")[0],
      dailyHours: dailyHours[0],
      subjects,
      tasks,
      createdAt: new Date().toISOString(),
    };

    setPlan(newPlan);
    addFeedback({
      id: String(Date.now()),
      message: `New study plan created! ${tasks.length} tasks scheduled across ${subjects.length} subjects. Good luck!`,
      type: "success",
      timestamp: new Date().toISOString(),
    });

    setIsGenerating(false);
    onNavigate("dashboard");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Study Plan</h1>
        <p className="mt-1 text-muted-foreground">
          Let AI create a personalized study schedule for you.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  "h-0.5 w-12 rounded-full transition-colors",
                  step > s ? "bg-primary" : "bg-secondary"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Target className="h-5 w-5 text-primary" />
              Basic Information
            </CardTitle>
            <CardDescription>Tell us about your study goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name</Label>
              <Input
                id="planName"
                placeholder="e.g., Final Exam Prep"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Exam Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-secondary border-border",
                      !examDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {examDate ? format(examDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={examDate}
                    onSelect={setExamDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!examDate}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Subjects */}
      {step === 2 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BookOpen className="h-5 w-5 text-primary" />
              Subjects
            </CardTitle>
            <CardDescription>Add the subjects you need to study.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Mathematics"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubject()}
                className="bg-secondary border-border"
              />
              <Button onClick={addSubject} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Badge
                    key={subject.id}
                    variant="secondary"
                    className="gap-2 py-2 pl-3 pr-2"
                    style={{ borderLeft: `3px solid ${subject.color}` }}
                  >
                    {subject.name}
                    <button
                      onClick={() => removeSubject(subject.id)}
                      className="rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                No subjects added yet. Add at least one subject to continue.
              </p>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep(3)}
                disabled={subjects.length === 0}
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Schedule */}
      {step === 3 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Daily Schedule
            </CardTitle>
            <CardDescription>How many hours can you study per day?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Daily Study Hours</Label>
                <span className="text-2xl font-bold text-primary">{dailyHours[0]}h</span>
              </div>
              <Slider
                value={dailyHours}
                onValueChange={setDailyHours}
                max={8}
                min={1}
                step={0.5}
                className="py-4"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 3-5 hours for optimal retention
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-xl bg-secondary/50 p-4 space-y-2">
              <h4 className="font-medium text-foreground">Plan Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  <span className="text-foreground font-medium">{planName || "My Study Plan"}</span>
                </p>
                <p>
                  Exam:{" "}
                  <span className="text-foreground">
                    {examDate ? format(examDate, "PPP") : "Not set"}
                  </span>
                </p>
                <p>
                  Subjects:{" "}
                  <span className="text-foreground">{subjects.map((s) => s.name).join(", ")}</span>
                </p>
                <p>
                  Daily hours: <span className="text-foreground">{dailyHours[0]}h</span>
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={generatePlan}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Plan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
