import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

import { LandingPage } from "@/components/cerebro/landing-page";
import { AuthPage } from "@/components/cerebro/auth-page";
import { AdminDashboard } from "@/components/cerebro/admin-dashboard";
import { Sidebar } from "@/components/cerebro/sidebar";
import { Dashboard } from "@/components/cerebro/dashboard";
import { TaskScheduler } from "@/components/cerebro/task-scheduler";
import { StudyPlanView } from "@/components/cerebro/study-plan-view";
import { CreatePlanForm } from "@/components/cerebro/create-plan-form";
import { Analytics } from "@/components/cerebro/analytics";
import { AIFeedbackPanel } from "@/components/cerebro/ai-feedback-panel";

export type View =
  | "landing"
  | "login"
  | "signup"
  | "dashboard"
  | "task-scheduler"
  | "study-plan"
  | "create-plan"
  | "analytics"
  | "admin";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);

  /* 🔐 CONNECT SUPABASE AUTH */
  useEffect(() => {
    // Check existing session on app load
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);

      if (data.user) {
        setCurrentView("dashboard");
      }
    });

    // Listen to login / logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          setCurrentView("dashboard");
        } else {
          setCurrentView("landing");
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* 🚪 LOGOUT */
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  /* 🧭 NAVIGATION */
  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
  };

  /* ⏳ LOADING GUARD */
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  /* 🌍 LANDING */
  if (currentView === "landing") {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  /* 🔐 AUTH SCREENS */
  if (currentView === "login" || currentView === "signup") {
    return <AuthPage mode={currentView} onNavigate={handleNavigate} />;
  }

  /* 🛡️ ADMIN DASHBOARD (TEMP ADMIN CHECK) */
  if (currentView === "admin" && user?.email?.includes("admin")) {
    return <AdminDashboard onLogout={handleLogout} userEmail={user.email!} />;
  }

  /* 📦 MAIN APP CONTENT */
  const renderMainView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentView} />;
      case "task-scheduler":
        return <TaskScheduler onNavigate={setCurrentView} />;
      case "study-plan":
        return <StudyPlanView onNavigate={setCurrentView} />;
      case "create-plan":
        return <CreatePlanForm onNavigate={setCurrentView} />;
      case "analytics":
        return <Analytics />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        onToggleAI={() => setShowAIPanel(!showAIPanel)}
        onLogout={handleLogout}
        userEmail={user?.email}
      />

      <main className="ml-64 flex-1 overflow-auto p-6">{renderMainView()}</main>

      <AIFeedbackPanel
        isOpen={showAIPanel}
        onClose={() => setShowAIPanel(false)}
      />
    </div>
  );
}
