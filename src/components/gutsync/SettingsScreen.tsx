import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Target,
  Watch,
  Shield,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const genderOptions = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "non-binary", label: "Non-binary" },
  { id: "prefer-not", label: "Prefer not to say" },
];

const goalOptions = [
  { id: "productivity", label: "Productivity", icon: "🎯" },
  { id: "mood", label: "Mood Balance", icon: "😊" },
  { id: "fertility", label: "Fertility", icon: "💚" },
  { id: "fitness", label: "Fitness", icon: "💪" },
];

interface SettingsScreenProps {
  onBack: () => void;
  onSignOut?: () => void;
  user?: { email?: string } | null;
}

export function SettingsScreen({ onBack, onSignOut, user }: SettingsScreenProps) {
  const [selectedGender, setSelectedGender] = useState("prefer-not");
  const [selectedGoals, setSelectedGoals] = useState(["productivity", "mood"]);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  return (
    <div className="min-h-screen bg-background pb-28 px-4">
      {/* Header */}
      <header className="pt-12 pb-6">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </header>

      {/* Profile Section */}
      <section className="mb-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">User Profile</h3>
              <p className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>
      </section>

      {/* Gender Identity */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Identity
        </h2>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Gender Identity</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {genderOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedGender(option.id)}
                className={cn(
                  "py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300",
                  selectedGender === option.id
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* Goals */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Your Goals
        </h2>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">What are you optimizing for?</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {goalOptions.map((goal) => (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={cn(
                  "py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2",
                  selectedGoals.includes(goal.id)
                    ? "bg-secondary/20 text-secondary border border-secondary/50"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                <span>{goal.icon}</span>
                {goal.label}
              </button>
            ))}
          </div>
        </Card>
      </section>

      {/* Integrations */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Integrations
        </h2>
        <Card variant="glass" className="divide-y divide-border/50">
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <Watch className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Wearables</p>
                <p className="text-xs text-muted-foreground">Connect fitness devices</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </Card>
      </section>

      {/* Preferences */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Preferences
        </h2>
        <Card variant="glass" className="divide-y divide-border/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Notifications</span>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted">
                <Moon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Dark Mode</span>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </Card>
      </section>

      {/* Privacy & Support */}
      <section className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">
          Support
        </h2>
        <Card variant="glass" className="divide-y divide-border/50">
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted">
                <Shield className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Privacy & Data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted">
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Help & FAQ</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </Card>
      </section>

      {/* Logout */}
      <button 
        onClick={onSignOut}
        className="w-full flex items-center justify-center gap-2 py-4 text-destructive hover:bg-destructive/10 rounded-2xl transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="font-medium">Sign Out</span>
      </button>
    </div>
  );
}
