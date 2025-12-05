import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIAssistantIcon } from "./AIAssistantIcon";
import { cn } from "@/lib/utils";
import { Brain, Sparkles, Activity, ChevronRight } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Brain,
    title: "Predict your mood, energy & fertility",
    description: "Our AI analyzes your biomarkers to forecast how you'll feel tomorrow.",
    gradient: "from-primary/30 via-transparent to-secondary/20",
  },
  {
    icon: Sparkles,
    title: "Optimize hormones & stress using AI",
    description: "Get personalized recommendations to balance your biology.",
    gradient: "from-secondary/30 via-transparent to-primary/20",
  },
  {
    icon: Activity,
    title: "Understand your body like never before",
    description: "Track patterns, discover insights, and take control of your wellbeing.",
    gradient: "from-primary/20 via-secondary/20 to-primary/30",
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br transition-all duration-1000", slide.gradient)} />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-40 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10 -mt-16">
        {/* Logo */}
        <div className="mb-10 slide-up">
          <h1 className="text-3xl font-bold gradient-text text-center">GUTSYNC</h1>
          <p className="text-xs text-muted-foreground text-center mt-1 tracking-widest">
            SYNC YOUR BIOLOGY
          </p>
        </div>

        {/* Icon */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-2xl opacity-30 scale-150" />
          <div className="relative glass-card p-8 rounded-full">
            <Icon className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8 slide-up" key={currentSlide}>
          <h2 className="text-2xl font-bold text-foreground mb-4 text-balance">
            {slide.title}
          </h2>
          <p className="text-muted-foreground text-balance max-w-xs mx-auto">
            {slide.description}
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 relative z-10">
        <Button
          variant="gradient"
          size="xl"
          className="w-full"
          onClick={handleNext}
        >
          {currentSlide < slides.length - 1 ? (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            "Get Started"
          )}
        </Button>
      </div>
    </div>
  );
}
