import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingScreen } from "@/components/gutsync/OnboardingScreen";
import { LoginScreen } from "@/components/gutsync/LoginScreen";
import { DashboardScreen } from "@/components/gutsync/DashboardScreen";
import { DailyInputScreen, PredictionResult } from "@/components/gutsync/DailyInputScreen";
import { InsightsScreen } from "@/components/gutsync/InsightsScreen";
import { SettingsScreen } from "@/components/gutsync/SettingsScreen";
import { BottomNav } from "@/components/gutsync/BottomNav";

type AppState = "loading" | "onboarding" | "login" | "app";
type AppTab = "home" | "log" | "insights" | "settings";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("loading");
  const [activeTab, setActiveTab] = useState<AppTab>("home");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [latestPrediction, setLatestPrediction] = useState<PredictionResult | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setAppState("app");
        } else {
          const hasSeenOnboarding = localStorage.getItem("gutsync_onboarding_complete");
          setAppState(hasSeenOnboarding ? "login" : "onboarding");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setAppState("app");
      } else {
        const hasSeenOnboarding = localStorage.getItem("gutsync_onboarding_complete");
        setAppState(hasSeenOnboarding ? "login" : "onboarding");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("gutsync_onboarding_complete", "true");
    setAppState("login");
  };

  const handleLogin = () => {
    setAppState("app");
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as AppTab);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAppState("login");
  };

  const handlePredictionGenerated = (prediction: PredictionResult) => {
    setLatestPrediction(prediction);
    setActiveTab("insights");
  };

  if (appState === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">GUTSYNC</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (appState === "onboarding") {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (appState === "login") {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {activeTab === "home" && <DashboardScreen onNavigate={handleNavigate} />}
      {activeTab === "log" && (
        <DailyInputScreen
          onBack={() => setActiveTab("home")}
          onGenerate={handlePredictionGenerated}
        />
      )}
      {activeTab === "insights" && (
        <InsightsScreen onBack={() => setActiveTab("home")} prediction={latestPrediction} />
      )}
      {activeTab === "settings" && (
        <SettingsScreen onBack={() => setActiveTab("home")} onSignOut={handleSignOut} user={user} />
      )}
      <BottomNav activeTab={activeTab} onTabChange={handleNavigate} />
    </div>
  );
};

export default Index;
