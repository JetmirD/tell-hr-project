"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { category: "Salary", value: 186 },
    { category: "Environment", value: 305 },
    { category: "Avg", value: 237 },
    { category: "Communication", value: 273 },
    { category: "Support", value: 209 },
    { category: "Recognition", value: 214 },
    { category: "Leadership", value: 195 },
    { category: "Remote", value: 220 },
    { category: "Worklife", value: 250 },
];
  

const chartConfig = {
    value: {
      label: "Sentiment",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

export function RadarChartComponent() {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Sentiments by Aspect</CardTitle>
        <CardDescription>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
      <ChartContainer
          config={chartConfig}
          className="mx-auto"
          style={{ width: "120%", maxWidth: "130%", height: "130%", marginLeft: "-10%" }}
        >
          <RadarChart data={chartData} style={{width:'150% !important'}}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="category" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="blue"
              fillOpacity={0.5}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />          
            </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Overall satisfaction has decreased this quarter<TrendingDown className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          September - November 2024
        </div>
      </CardFooter>
    </Card>
  )
}
