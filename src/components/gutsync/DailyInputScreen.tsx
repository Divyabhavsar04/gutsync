import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Moon,
  Activity,
  Coffee,
  Apple,
  Dumbbell,
  ChevronLeft,
  Sparkles,
  Check,
  Loader2,
  MessageCircle,
} from "lucide-react";

const moodEmojis = [
  { emoji: "😔", label: "Low", value: 1 },
  { emoji: "😐", label: "Meh", value: 2 },
  { emoji: "🙂", label: "Okay", value: 3 },
  { emoji: "😊", label: "Good", value: 4 },
  { emoji: "😄", label: "Great", value: 5 },
];

const energyLevels = [
  { label: "Exhausted", value: 1 },
  { label: "Low", value: 2 },
  { label: "Moderate", value: 3 },
  { label: "High", value: 4 },
  { label: "Peak", value: 5 },
];

const quickInputs = [
  { icon: Coffee, label: "Caffeine", active: false },
  { icon: Apple, label: "Healthy Diet", active: true },
  { icon: Dumbbell, label: "Exercise", active: true },
];

const symptoms = [
  "Headache",
  "Fatigue",
  "Bloating",
  "Anxiety",
  "Brain Fog",
  "Cramps",
  "Insomnia",
  "Joint Pain",
];

export interface PredictionResult {
  finalScore: number;
  riskLevel: string;
  recommendation: string;
  warnings: string[];
  penalties: string[];
  stressInsight?: string;
}

interface DailyInputScreenProps {
  onBack: () => void;
  onGenerate: (prediction: PredictionResult) => void;
}

export function DailyInputScreen({ onBack, onGenerate }: DailyInputScreenProps) {
  const [sleep, setSleep] = useState([7]);
  const [stress, setStress] = useState([4]);
  const [selectedMood, setSelectedMood] = useState(3);
  const [selectedEnergy, setSelectedEnergy] = useState(3);
  const [activeInputs, setActiveInputs] = useState<string[]>(["Healthy Diet", "Exercise"]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [stressReason, setStressReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleInput = (label: string) => {
    setActiveInputs((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleGeneratePrediction = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prediction', {
        body: {
          sleep: sleep[0],
          stress: stress[0],
          mood: selectedMood,
          energy: selectedEnergy,
          symptoms: selectedSymptoms,
          quickInputs: activeInputs,
          stressReason: stressReason.trim(),
        }
      });

      if (error) throw error;

      toast({
        title: "Prediction Generated",
        description: `Risk Level: ${data.riskLevel}`,
      });

      onGenerate(data as PredictionResult);
    } catch (error) {
      console.error('Error generating prediction:', error);
      toast({
        title: "Error",
        description: "Failed to generate prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-foreground">Daily Log</h1>
        </div>
        <p className="text-muted-foreground text-sm ml-12">
          Log your biomarkers for AI analysis
        </p>
      </header>

      {/* Sleep Input */}
      <section className="mb-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/20">
              <Moon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Sleep Hours</p>
              <p className="text-xs text-muted-foreground">Last night</p>
            </div>
            <span className="metric-number text-2xl text-primary">{sleep[0]}h</span>
          </div>
          <Slider
            value={sleep}
            onValueChange={setSleep}
            min={0}
            max={12}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0h</span>
            <span>12h</span>
          </div>
        </Card>
      </section>

      {/* Stress Level */}
      <section className="mb-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-secondary/20">
              <Activity className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Stress Level</p>
              <p className="text-xs text-muted-foreground">How stressed do you feel?</p>
            </div>
            <span className="metric-number text-2xl text-secondary">{stress[0]}/10</span>
          </div>
          <Slider
            value={stress}
            onValueChange={setStress}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Calm</span>
            <span>Very Stressed</span>
          </div>
        </Card>
      </section>

      {/* Stress Reason */}
      <section className="mb-6">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-primary/20">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">What's causing your stress?</p>
              <p className="text-xs text-muted-foreground">Optional - helps personalize insights</p>
            </div>
          </div>
          <Textarea
            placeholder="e.g., exams, workload, relationships, health concerns, lack of sleep..."
            value={stressReason}
            onChange={(e) => setStressReason(e.target.value)}
            className="bg-muted/50 border-muted-foreground/20 resize-none text-sm"
            rows={2}
            maxLength={200}
          />
        </Card>
      </section>

      {/* Mood Selector */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">How's your mood?</h2>
        <div className="flex justify-between gap-2">
          {moodEmojis.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300",
                selectedMood === mood.value
                  ? "bg-primary/20 border border-primary scale-105"
                  : "bg-muted/50 border border-transparent hover:bg-muted"
              )}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-[10px] text-muted-foreground">{mood.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Energy Level */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Energy Level</h2>
        <div className="flex gap-2">
          {energyLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setSelectedEnergy(level.value)}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-medium transition-all duration-300",
                selectedEnergy === level.value
                  ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {level.label}
            </button>
          ))}
        </div>
      </section>

      {/* Quick Inputs */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Quick Inputs</h2>
        <div className="flex gap-3">
          {quickInputs.map((input) => {
            const Icon = input.icon;
            const isActive = activeInputs.includes(input.label);
            return (
              <button
                key={input.label}
                onClick={() => toggleInput(input.label)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300",
                  isActive
                    ? "bg-secondary/20 border border-secondary"
                    : "bg-muted/50 border border-transparent hover:bg-muted"
                )}
              >
                <Icon
                  className={cn("w-5 h-5", isActive ? "text-secondary" : "text-muted-foreground")}
                />
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive ? "text-secondary" : "text-muted-foreground"
                  )}
                >
                  {input.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Symptoms */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">Any Symptoms?</h2>
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom) => {
            const isSelected = selectedSymptoms.includes(symptom);
            return (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1",
                  isSelected
                    ? "bg-destructive/20 text-destructive border border-destructive/50"
                    : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted"
                )}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {symptom}
              </button>
            );
          })}
        </div>
      </section>

      {/* Generate Button */}
      <Button 
        variant="gradient" 
        size="xl" 
        className="w-full" 
        onClick={handleGeneratePrediction}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
        {isLoading ? "Analyzing..." : "Generate Prediction"}
      </Button>
    </div>
  );
}
