import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface MiniChartProps {
  data: { value: number }[];
  color?: "blue" | "mint";
  height?: number;
}

export function MiniChart({ data, color = "blue", height = 60 }: MiniChartProps) {
  const strokeColor = color === "blue" ? "hsl(228 100% 68%)" : "hsl(162 70% 65%)";
  const fillColor = color === "blue" ? "url(#blueGradient)" : "url(#mintGradient)";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(228 100% 68%)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="hsl(228 100% 68%)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="mintGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(162 70% 65%)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="hsl(162 70% 65%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke={strokeColor}
          strokeWidth={2}
          fill={fillColor}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
