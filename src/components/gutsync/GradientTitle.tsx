import { cn } from "@/lib/utils";

interface GradientTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
}

export function GradientTitle({ children, className, size = "lg", glow = false }: GradientTitleProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl",
  };

  return (
    <div className={cn("relative py-2", glow && "glow-title-container")}>
      {glow && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 flex items-center justify-center font-bold tracking-wider uppercase blur-[5px] opacity-40 pointer-events-none select-none",
            "bg-gradient-to-r from-primary via-secondary to-gutsync-mint bg-clip-text text-transparent",
            sizeClasses[size]
          )}
        >
          {children}
        </span>
      )}
      <h1
        className={cn(
          "relative font-bold gradient-text animate-fade-in tracking-wider uppercase",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </h1>
    </div>
  );
}
