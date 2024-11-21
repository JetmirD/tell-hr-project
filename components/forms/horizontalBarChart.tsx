"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
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

const chartConfig: ChartConfig = {
  Frontend: { label: "Frontend", color: "hsl(var(--chart-1))" },
  Backend: { label: "Backend", color: "hsl(var(--chart-2))" },
  DataEngineering: { label: "Data-Eng", color: "hsl(0 72.2% 50.6%)" },
  SoftwareEngineering: {
    label: "Sales",
    color: "hsl(175.9 60.8% 19%)",
  },
  BusinessIntelligence: {
    label: "ML",
    color: "hsl(295.4 70.2% 32.9%)",
  },

};

const normalizeKey = (key: string) =>
  key.toLowerCase().replace(/[^a-z0-9]/g, "");

interface ChartData {
  department: string;
  averageRiskScore: number;
}

interface HorizontalBarChartProps {
  data: ChartData[];
}

export function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  const mappedData = Object.keys(chartConfig).map((departmentKey) => {
    const departmentData = data.find(
      (d) => normalizeKey(d.department) === normalizeKey(departmentKey)
    );

    return {
      department: departmentKey,
      RiskScore: departmentData ? departmentData.averageRiskScore : 0,
      fill: chartConfig[departmentKey as keyof typeof chartConfig]?.color || "#000000", // Apply correct color or default to black
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{textAlign:'center'}}>Departments</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={mappedData}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            {/* Ensure Y-axis labels align with bars */}
            <YAxis
              dataKey="department"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />
            <XAxis dataKey="RiskScore" type="number" />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="RiskScore" layout="vertical" radius={5} fill="fill" />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center justify-center text-center gap-2 text-sm">
  <div className="flex items-center justify-center gap-2 font-medium leading-none">
    Data Engineering up by 5.2% this month <TrendingUp className="h-4 w-4" />
  </div>
  <div className="flex items-center justify-center gap-2 leading-none text-muted-foreground">
    Displaying the 5 departments with the highest risk of employee turnover.
  </div>
</CardFooter>
    </Card>
  )
}
