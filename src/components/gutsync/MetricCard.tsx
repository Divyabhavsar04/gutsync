import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  icon: React.ReactNode;
  color?: "blue" | "mint" | "neutral";
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = "blue",
  className,
}: MetricCardProps) {
  const colorStyles = {
    blue: "from-primary/20 to-transparent",
    mint: "from-secondary/20 to-transparent",
    neutral: "from-muted/40 to-transparent",
  };

  const iconBgStyles = {
    blue: "bg-primary/20 text-primary",
    mint: "bg-secondary/20 text-secondary",
    neutral: "bg-muted text-muted-foreground",
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-secondary" : trend === "down" ? "text-destructive" : "text-muted-foreground";

  return (
    <Card variant="metric" className={cn("relative overflow-hidden", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", colorStyles[color])} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("p-2.5 rounded-xl", iconBgStyles[color])}>
            {icon}
          </div>
          {trend && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", trendColor)}>
              <TrendIcon className="w-3 h-3" />
              {trendValue}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="metric-number text-2xl text-foreground">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
      </div>
    </Card>
  );
}
