"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Calendar,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (view: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Planning",
      description:
        "Smart algorithms analyze your schedule and create personalized study plans that adapt to your progress.",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Automatically distribute study sessions across days, balancing difficult topics with lighter material.",
    },
    {
      icon: BarChart3,
      title: "Progress Analytics",
      description:
        "Track your study habits with detailed charts and insights to optimize your learning efficiency.",
    },
    {
      icon: Sparkles,
      title: "Adaptive Feedback",
      description:
        "Receive real-time suggestions to prevent burnout and maximize retention based on your patterns.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "85%", label: "Exam Success Rate" },
    { value: "4.9", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CEREBRO</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How it Works
            </a>
            <a
              href="#testimonials"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onNavigate("login")}
            >
              Log In
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => onNavigate("signup")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              AI-Powered Study Planning
            </div>
            <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Study Smarter,{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Not Harder
              </span>
            </h1>
            <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl">
              CEREBRO uses artificial intelligence to create personalized study
              plans that adapt to your learning style, track your progress, and
              help you achieve your academic goals.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="w-full bg-primary px-8 text-primary-foreground hover:bg-primary/90 sm:w-auto"
                onClick={() => onNavigate("signup")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-border bg-transparent text-foreground hover:bg-secondary sm:w-auto"
                onClick={() => onNavigate("login")}
              >
                Log In to Dashboard
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Everything you need to excel
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Powerful features designed to help you study more effectively and
              achieve your academic goals.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              How CEREBRO Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Get started in minutes and let AI optimize your study schedule.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Target,
                title: "Set Your Goals",
                description:
                  "Enter your exam dates, subjects, and available study time. CEREBRO will understand your constraints.",
              },
              {
                step: "02",
                icon: Brain,
                title: "AI Creates Your Plan",
                description:
                  "Our AI analyzes your inputs and generates an optimized study schedule tailored to your needs.",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Track & Improve",
                description:
                  "Follow your plan, track progress, and receive real-time adjustments to stay on course.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-2 right-1/2 translate-x-8 text-6xl font-bold text-primary/10">
                  {item.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Loved by students worldwide
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote:
                  "CEREBRO helped me go from struggling to pass to scoring in the top 10% of my class. The AI suggestions are spot on!",
                author: "Sarah M.",
                role: "Medical Student",
              },
              {
                quote:
                  "I used to procrastinate constantly. Now I have a clear plan every day and actually enjoy studying. Game changer!",
                author: "James K.",
                role: "Engineering Student",
              },
              {
                quote:
                  "The analytics feature showed me I was spending too much time on easy topics. CEREBRO rebalanced my schedule perfectly.",
                author: "Emily R.",
                role: "Law Student",
              },
            ].map((testimonial) => (
              <Card key={testimonial.author} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle2 key={i} className="h-4 w-4 text-primary" />
                    ))}
                  </div>
                  <p className="mb-4 text-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Card className="border-primary/20 bg-linear-to-br from-primary/10 to-accent/10">
            <CardContent className="flex flex-col items-center p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Ready to transform your study habits?
              </h2>
              <p className="mb-8 max-w-xl text-muted-foreground">
                Join thousands of students who are already studying smarter with
                CEREBRO. Start your free trial today.
              </p>
              <Button
                size="lg"
                className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
                onClick={() => onNavigate("signup")}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">CEREBRO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 CEREBRO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
