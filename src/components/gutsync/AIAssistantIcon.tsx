import { cn } from "@/lib/utils";

interface AIAssistantIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AIAssistantIcon({ className, size = "md" }: AIAssistantIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary animate-pulse-glow",
        sizeClasses[size],
        className
      )}
    >
      <div className="absolute inset-1 rounded-xl bg-background/80 backdrop-blur-sm" />
      <svg
        viewBox="0 0 24 24"
        className="relative z-10 w-1/2 h-1/2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="3" className="fill-primary stroke-primary" />
        <path
          d="M12 2v4m0 12v4M2 12h4m12 0h4"
          className="stroke-secondary"
          strokeLinecap="round"
        />
        <circle
          cx="12"
          cy="12"
          r="8"
          className="stroke-primary/50"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
}
