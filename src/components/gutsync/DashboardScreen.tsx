import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricCard } from "./MetricCard";
import { MiniChart } from "./MiniChart";
import { AIAssistantIcon } from "./AIAssistantIcon";
import { WaveAnimation } from "./WaveAnimation";
import { GradientTitle } from "./GradientTitle";
import {
  Smile,
  Activity,
  Zap,
  Brain,
  Heart,
  TrendingUp,
  Plus,
} from "lucide-react";

const weekData = [
  { value: 65 },
  { value: 72 },
  { value: 68 },
  { value: 78 },
  { value: 74 },
  { value: 82 },
  { value: 85 },
];

const stressData = [
  { value: 45 },
  { value: 52 },
  { value: 38 },
  { value: 42 },
  { value: 35 },
  { value: 30 },
  { value: 28 },
];

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  return (
    <div className="min-h-screen bg-background pb-28 px-4">
      {/* Header */}
      <header className="pt-12 pb-6">
        {/* Hero Title */}
        <div className="mb-6 text-center px-4">
          <GradientTitle size="xl" glow>GUTSYNC</GradientTitle>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Good morning</p>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          </div>
          <AIAssistantIcon size="sm" />
        </div>

        {/* Today's Overview Card */}
        <Card variant="gradient" className="p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <WaveAnimation bars={5} className="h-6" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Today's Sync Status
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="metric-number text-4xl gradient-text">87</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Your biology is well-balanced today
            </p>
          </div>
        </Card>
      </header>

      {/* Metrics Grid */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Key Metrics</h2>
          <button className="text-sm text-primary">View All</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            title="Mood Score"
            value={82}
            unit="/100"
            trend="up"
            trendValue="+5"
            icon={<Smile className="w-4 h-4" />}
            color="blue"
          />
          <MetricCard
            title="Hormone Balance"
            value={78}
            unit="%"
            trend="stable"
            icon={<Activity className="w-4 h-4" />}
            color="mint"
          />
          <MetricCard
            title="Stress Level"
            value={28}
            unit="/100"
            trend="down"
            trendValue="-12"
            icon={<Brain className="w-4 h-4" />}
            color="mint"
          />
          <MetricCard
            title="Energy Forecast"
            value={85}
            unit="%"
            trend="up"
            trendValue="+8"
            icon={<Zap className="w-4 h-4" />}
            color="blue"
          />
        </div>
      </section>

      {/* Wellness Score */}
      <section className="mb-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-secondary/20">
                <Heart className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Wellness Score</p>
                <p className="text-xs text-muted-foreground">Sexual & reproductive health</p>
              </div>
            </div>
            <div className="text-right">
              <span className="metric-number text-2xl text-secondary">74</span>
              <span className="text-xs text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
              style={{ width: "74%" }}
            />
          </div>
        </Card>
      </section>

      {/* 7-Day Trends */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">7-Day Trends</h2>
          <div className="flex items-center gap-1 text-xs text-secondary">
            <TrendingUp className="w-3 h-3" />
            Improving
          </div>
        </div>

        <div className="grid gap-3">
          <Card variant="glassSubtle" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Mood Trend</span>
              <span className="metric-number text-sm text-primary">+12%</span>
            </div>
            <MiniChart data={weekData} color="blue" />
          </Card>

          <Card variant="glassSubtle" className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Stress Trend</span>
              <span className="metric-number text-sm text-secondary">-18%</span>
            </div>
            <MiniChart data={stressData} color="mint" />
          </Card>
        </div>
      </section>

      {/* Log CTA */}
      <Button
        variant="gradient"
        size="xl"
        className="w-full"
        onClick={() => onNavigate("log")}
      >
        <Plus className="w-5 h-5" />
        Log Daily Inputs
      </Button>
    </div>
  );
}
