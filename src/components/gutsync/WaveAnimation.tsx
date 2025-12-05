import { cn } from "@/lib/utils";

interface WaveAnimationProps {
  className?: string;
  bars?: number;
}

export function WaveAnimation({ className, bars = 5 }: WaveAnimationProps) {
  return (
    <div className={cn("flex items-end gap-1 h-8", className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="wave-bar w-1 bg-gradient-to-t from-primary to-secondary rounded-full"
          style={{
            height: `${Math.random() * 50 + 50}%`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
