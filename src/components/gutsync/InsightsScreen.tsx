import { Card } from "@/components/ui/card";
import { MiniChart } from "./MiniChart";
import { AIAssistantIcon } from "./AIAssistantIcon";
import { PredictionResult } from "./DailyInputScreen";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  Heart,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const moodData = [
  { value: 65 },
  { value: 68 },
  { value: 72 },
  { value: 70 },
  { value: 78 },
  { value: 82 },
  { value: 85 },
];

const radarData = [
  { metric: "Cortisol", value: 75, fullMark: 100 },
  { metric: "Estrogen", value: 82, fullMark: 100 },
  { metric: "Testosterone", value: 68, fullMark: 100 },
  { metric: "Melatonin", value: 90, fullMark: 100 },
  { metric: "Serotonin", value: 72, fullMark: 100 },
  { metric: "Dopamine", value: 78, fullMark: 100 },
];

const scatterData = [
  { stress: 8, sleep: 5, name: "Mon" },
  { stress: 6, sleep: 6, name: "Tue" },
  { stress: 4, sleep: 7, name: "Wed" },
  { stress: 5, sleep: 6.5, name: "Thu" },
  { stress: 3, sleep: 8, name: "Fri" },
  { stress: 2, sleep: 8.5, name: "Sat" },
  { stress: 3, sleep: 7.5, name: "Sun" },
];

interface InsightsScreenProps {
  onBack: () => void;
  prediction?: PredictionResult | null;
}

function getRiskLevelIcon(riskLevel: string) {
  if (riskLevel.includes('Excellent')) return <CheckCircle2 className="w-5 h-5 text-secondary" />;
  if (riskLevel.includes('Stable')) return <Sparkles className="w-5 h-5 text-primary" />;
  if (riskLevel.includes('Needs Recovery')) return <AlertCircle className="w-5 h-5 text-amber-400" />;
  return <ShieldAlert className="w-5 h-5 text-destructive" />;
}

function getRiskLevelColor(riskLevel: string): string {
  if (riskLevel.includes('Excellent')) return 'text-secondary';
  if (riskLevel.includes('Stable')) return 'text-primary';
  if (riskLevel.includes('Needs Recovery')) return 'text-amber-400';
  return 'text-destructive';
}

function getScoreColor(score: number): string {
  if (score >= 0.8) return 'from-secondary to-secondary/50';
  if (score >= 0.6) return 'from-primary to-primary/50';
  if (score >= 0.4) return 'from-amber-400 to-amber-400/50';
  return 'from-destructive to-destructive/50';
}

export function InsightsScreen({ onBack, prediction }: InsightsScreenProps) {
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
          <h1 className="text-2xl font-bold text-foreground">AI Insights</h1>
        </div>
        <p className="text-muted-foreground text-sm ml-12">
          Personalized predictions & analysis
        </p>
      </header>

      {/* Prediction Results Card - Only shown when prediction exists */}
      {prediction && (
        <section className="mb-6">
          <Card variant="glow" className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl" />
            <div className="relative z-10">
              {/* Score Display */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <AIAssistantIcon size="sm" />
                  <div>
                    <p className="text-xs text-muted-foreground">Your Wellness Score</p>
                    <p className="text-3xl font-bold text-foreground metric-number">
                      {Math.round(prediction.finalScore * 100)}
                      <span className="text-lg text-muted-foreground">/100</span>
                    </p>
                  </div>
                </div>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getScoreColor(prediction.finalScore)} flex items-center justify-center`}>
                  {getRiskLevelIcon(prediction.riskLevel)}
                </div>
              </div>

              {/* Risk Level */}
              <div className="mb-4 p-3 rounded-xl bg-background/50">
                <div className="flex items-center gap-2 mb-1">
                  {getRiskLevelIcon(prediction.riskLevel)}
                  <span className={`text-sm font-semibold ${getRiskLevelColor(prediction.riskLevel)}`}>
                    {prediction.riskLevel}
                  </span>
                </div>
              </div>

              {/* Warnings */}
              {prediction.warnings.length > 0 && (
                <div className="mb-4 space-y-2">
                  {prediction.warnings.map((warning, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-amber-400/10 border border-amber-400/20">
                      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-amber-200">{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Penalties Applied */}
              {prediction.penalties.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Penalties Applied:</p>
                  <div className="flex flex-wrap gap-2">
                    {prediction.penalties.map((penalty, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full bg-destructive/20 text-destructive text-[10px]">
                        {penalty.split(':')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">Personalized Recommendation</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  {prediction.recommendation}
                </p>
              </div>

              {/* Stress Insight */}
              {prediction.stressInsight && (
                <div className="mt-4 p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-semibold text-secondary">Stress Support</span>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {prediction.stressInsight}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </section>
      )}

      {/* AI Insight Card - Shown when no prediction */}
      {!prediction && (
        <section className="mb-6">
          <Card variant="glow" className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-start gap-3 mb-4">
                <AIAssistantIcon size="sm" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-400 font-medium">No Recent Analysis</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    Log your daily biomarkers to receive personalized AI predictions and recommendations.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Mood Trend */}
      <section className="mb-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">Mood Trend</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-secondary">
              <TrendingUp className="w-3 h-3" />
              +18% this week
            </div>
          </div>
          <div className="h-20">
            <MiniChart data={moodData} color="blue" height={80} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </Card>
      </section>

      {/* Hormone Radar */}
      <section className="mb-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-secondary/20">
              <Lightbulb className="w-4 h-4 text-secondary" />
            </div>
            <span className="font-medium text-foreground">Hormone Stability</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220 14% 20%)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "hsl(220 10% 60%)", fontSize: 10 }}
                />
                <Radar
                  name="Current"
                  dataKey="value"
                  stroke="hsl(228 100% 68%)"
                  fill="hsl(228 100% 68%)"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Stress vs Sleep Correlation */}
      <section className="mb-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-foreground">Stress vs Sleep</span>
            <span className="text-xs text-muted-foreground">Correlation: -0.82</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <XAxis
                  dataKey="sleep"
                  type="number"
                  domain={[4, 10]}
                  tick={{ fill: "hsl(220 10% 60%)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(220 14% 20%)" }}
                  label={{ value: "Sleep (h)", position: "bottom", fill: "hsl(220 10% 60%)", fontSize: 10 }}
                />
                <YAxis
                  dataKey="stress"
                  type="number"
                  domain={[0, 10]}
                  tick={{ fill: "hsl(220 10% 60%)", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "hsl(220 14% 20%)" }}
                  label={{ value: "Stress", angle: -90, position: "insideLeft", fill: "hsl(220 10% 60%)", fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220 14% 10%)",
                    border: "1px solid hsl(220 14% 20%)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Scatter data={scatterData} fill="hsl(162 70% 65%)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* Key Insight */}
      <Card variant="glassSubtle" className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-primary/20 mt-0.5">
            <Lightbulb className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Key Pattern Detected</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your mood consistently improves 24-48 hours after getting 7+ hours of sleep. 
              Prioritizing sleep on weeknights could boost your weekday productivity by ~20%.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
