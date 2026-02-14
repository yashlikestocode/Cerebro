"use client"

import React from "react"

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axiosinstance";
import { supabase } from "@/lib/supabase";
import {
  Bot,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
  Brain,
  ArrowRight,
  Plus,
} from "lucide-react";

interface PlanStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  estimatedTime: string;
}


export function Dashboard() {
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [plan, setPlan] = useState<PlanStep[] | null>(null);
  const [agentMessage, setAgentMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (agentMessage && !isProcessing) {
      let i = 0;
      setTypingText("");
      const typeWriter = () => {
        if (i < agentMessage.length) {
          setTypingText(agentMessage.slice(0, i + 1));
          i++;
          setTimeout(typeWriter, 20);
        }
      };
      typeWriter();
    }
  }, [agentMessage, isProcessing]);

  //       {
  //         id: "2",
  //         title: "Gather Resources",
  //         description:
  //           "Collect relevant books, tutorials, videos, and practice materials",
  //         status: "pending",
  //         estimatedTime: "45 mins",
  //       },
  //       {
  //         id: "3",
  //         title: "Create Study Schedule",
  //         description: "Break down the learning into manageable daily sessions",
  //         status: "pending",
  //         estimatedTime: "20 mins",
  //       },
  //       {
  //         id: "4",
  //         title: "Start Learning",
  //         description: `Begin with the basics of ${userInput} and track your progress`,
  //         status: "pending",
  //         estimatedTime: "Ongoing",
  //       },
  //     ];

  //     setPlan(generatedPlan);
  //     setAgentMessage(
  //       `I've crafted a personalized learning journey for "${userInput}". Ready to transform your goals into achievements?`
  //     );
  //     setIsProcessing(false);
  //   }, 2500);
  // };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!userInput.trim()) return;

  setIsProcessing(true);

  const updatedMessages: { role: "user" | "assistant"; content: string }[] = [
    ...messages,
    { role: "user", content: userInput },
  ];

  setMessages(updatedMessages);

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setAgentMessage("Please log in first.");
      setIsProcessing(false);
      return;
    }

    const res = await axiosInstance.post(
      "/plans",
      { messages: updatedMessages },
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );

    const data = res.data;

    if (data.type === "question") {
      setAgentMessage(data.question);

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.question },
      ]);
    }

    if (data.type === "plan") {
      setAgentMessage(data.summary);

      const formattedPlan: PlanStep[] = data.plan.map(
        (step: any, index: number) => ({
          id: step.stepId || (index + 1).toString(),
          title: step.title,
          description: step.description,
          status: "pending",
          estimatedTime: step.estimatedTime || "Flexible",
        }),
      );

      setPlan(formattedPlan);
    }
  } catch (err) {
    console.error(err);
    setAgentMessage("Something went wrong. Please try again.");
  } finally {
    setIsProcessing(false);
    setUserInput("");
  }
};

  const executeStep = (stepId: string) => {
    setPlan(
      (prev) =>
        prev?.map((step) =>
          step.id === stepId ? { ...step, status: "in-progress" as const } : step
        ) || null
    );

    setTimeout(() => {
      setPlan(
        (prev) =>
          prev?.map((step) =>
            step.id === stepId ? { ...step, status: "completed" as const } : step
          ) || null
      );
    }, 1500);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      {/* Subtle gradient follow cursor */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.03), transparent 40%)`,
        }}
      />

      {/* Minimal ambient light */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-800px h-400px bg-linear-to-b from-foreground/0.02 to-transparent blur-3xl pointer-events-none" />

      <div
        className={`relative z-10 max-w-3xl mx-auto px-6 py-16 space-y-10 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <header className="text-center space-y-6 mb-20">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 text-xs text-muted-foreground tracking-wide uppercase animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <Sparkles className="h-3 w-3" />
            <span>AI Learning Assistant</span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-light text-foreground tracking-tight leading-tight animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Master anything
            <span className="block font-medium mt-1">with AI guidance</span>
          </h1>

          <p
            className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            Tell me what you want to learn, and I'll create a personalized roadmap for you.
          </p>
        </header>

        {/* Agent Status */}
        <div
          className="flex items-center justify-center gap-3 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border/50">
              <Bot className="h-4 w-4 text-foreground" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-foreground/80 border-2 border-background" />
          </div>
          <div className="text-sm">
            <span className="text-foreground font-medium">Learning Assistant</span>
            <span className="text-muted-foreground ml-2">Ready to help</span>
          </div>
        </div>

        {/* Input Form */}
        {!plan && (
          <Card
            className="border-border/40 bg-card/50 backdrop-blur-sm shadow-none animate-scale-in"
            style={{ animationDelay: "0.5s" }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-muted-foreground" />
                What do you want to learn?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <Textarea
                    placeholder="e.g., Machine Learning, Fuck, SMIT, Pornography..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-100px resize-none text-sm bg-secondary/30 border-border/40 focus:border-foreground/20 focus:bg-secondary/50 transition-all duration-300 placeholder:text-muted-foreground/50"
                    disabled={isProcessing}
                  />
                  <div className="absolute bottom-2.5 right-3 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                    <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground font-mono border border-border/50">
                      Enter
                    </kbd>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!userInput.trim() || isProcessing}
                  className="w-full h-11 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 group"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating plan...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-3.5 w-3.5" />
                      Generate Plan
                      <ArrowRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Agent Response */}
        {agentMessage && (
          <div
            className="flex items-start gap-3 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border/50">
              <Bot className="h-3.5 w-3.5 text-foreground" />
            </div>
            <div className="flex-1 pt-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/50 animate-bounce" />
                      <span
                        className="w-1 h-1 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                      />
                      <span
                        className="w-1 h-1 rounded-full bg-muted-foreground/50 animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </span>
                    <span>{agentMessage}</span>
                  </span>
                ) : (
                  <>
                    {typingText}
                    {typingText.length < agentMessage.length && (
                      <span className="inline-block w-px h-4 bg-foreground/50 animate-pulse ml-0.5 align-middle" />
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Generated Plan */}
        {plan && (
          <Card
            className="border-border/40 bg-card/50 backdrop-blur-sm shadow-none animate-scale-in overflow-hidden"
          >
            <CardHeader className="pb-4 border-b border-border/30">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                Your Learning Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {plan.map((step, index) => (
                  <div
                    key={step.id}
                    className={`group relative p-4 rounded-lg border transition-all duration-300 ${
                      step.status === "completed"
                        ? "bg-foreground/0.03 border-foreground/10"
                        : step.status === "in-progress"
                          ? "bg-secondary/50 border-foreground/20"
                          : "bg-transparent border-border/40 hover:border-border hover:bg-secondary/30"
                    }`}
                    style={{
                      opacity: 0,
                      animation: `slide-up 0.4s ease-out ${index * 0.08}s forwards`,
                    }}
                  >
                    {/* Vertical connector line */}
                    {index < plan.length - 1 && (
                      <div
                        className={`absolute left-23px top-52px w-px h-[calc(100%-12px)] transition-colors duration-300 ${
                          step.status === "completed"
                            ? "bg-foreground/20"
                            : "bg-border/50"
                        }`}
                      />
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-all duration-300 ${
                            step.status === "completed"
                              ? "bg-foreground text-background"
                              : step.status === "in-progress"
                                ? "bg-foreground/80 text-background"
                                : "bg-secondary text-muted-foreground border border-border/50"
                          }`}
                        >
                          {step.status === "completed" ? (
                            <CheckCircle className="h-3.5 w-3.5" />
                          ) : step.status === "in-progress" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="space-y-1 pt-0.5">
                          <h3 className="text-sm font-medium text-foreground">
                            {step.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70 pt-0.5">
                            <Clock className="h-2.5 w-2.5" />
                            {step.estimatedTime}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 pt-0.5">
                        {step.status === "completed" ? (
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            Done
                          </span>
                        ) : step.status === "in-progress" ? (
                          <span className="text-[10px] text-foreground/70 uppercase tracking-wider">
                            Working...
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => executeStep(step.id)}
                            className="h-7 px-2.5 text-xs bg-secondary/50 hover:bg-secondary text-foreground/80 hover:text-foreground transition-all duration-200"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border/30">
                <Button
                  onClick={() => {
                    setPlan(null);
                    setUserInput("");
                    setAgentMessage("");
                    setTypingText("");
                  }}
                  variant="outline"
                  className="w-full h-10 text-sm bg-transparent border-border/40 text-muted-foreground hover:text-foreground hover:border-border hover:bg-secondary/30 transition-all duration-300"
                >
                  <Plus className="h-3.5 w-3.5 mr-2" />
                  New Learning Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
