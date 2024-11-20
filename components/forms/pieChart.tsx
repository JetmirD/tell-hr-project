"use client";

import React from "react";
import { TrendingUp, TrendingDown, Circle } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface RiskLevelData {
  riskLevel: string;
  count: number;
  fill: string;
}

interface PieChartProps {
  data: { riskLevel: string }[];
  totalSurveys: number; // Receive totalSurveys as a prop
}

const PieChartComponent: React.FC<PieChartProps> = ({ data, totalSurveys }) => {
  console.log(data)
  const riskCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
    };

    data.forEach((entry) => {
      if (counts[entry.riskLevel] !== undefined) {
        counts[entry.riskLevel]++;
      }
    });

    return counts;
  }, [data]);
  console.log("jetmir", riskCounts)

  const { low: lowCount, medium: mediumCount, high: highCount } = riskCounts;

  const chartData: RiskLevelData[] = [
    { riskLevel: "low", count: lowCount, fill: "var(--color-safari)" },
    { riskLevel: "medium", count: mediumCount, fill: "var(--color-firefox)" },
    { riskLevel: "high", count: highCount, fill: "var(--color-other)" },
  ];

  // Determine the trend
  let trendText = "Neutral trending this month";
  let trendIcon = <Circle className="h-4 w-4" />; // Fallback neutral icon

  if (lowCount > mediumCount + highCount) {
    trendText = "Positive trending this month";
    trendIcon = <TrendingUp className="h-4 w-4" />;
  } else if (highCount > lowCount + mediumCount) {
    trendText = "Negative trending this month";
    trendIcon = <TrendingDown className="h-4 w-4" />;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Feedback Overview</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[250px]"
          config={{
            visitors: { label: "Visitors" },
            safari: { label: "Safari", color: "hsl(var(--chart-2))" },
            firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
            other: { label: "Other", color: "hsl(var(--chart-5))" },
          }}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="riskLevel"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalSurveys.toLocaleString()} {/* Use totalSurveys prop */}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Surveys
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {trendText} {trendIcon}
        </div>
        <div className="leading-none text-muted-foreground text-center">
           Showing positive, negative, and neutral sentiment relation
        </div>
      </CardFooter>
    </Card>
  );
};

export default PieChartComponent;
