"use client"

import { Circle, TrendingDown, TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
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

export function LineChartComponent({ data }: { data: { month: string, sentiment: number }[] }) {
  const sortedData = data.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  const chartData = sortedData.map((item: any) => ({
    month: new Date(item.month).toLocaleDateString('en-US', { month: 'long' }), 
    sentiment: Number(item.sentiment.toString().slice(0, 4)), 
  }));

  // Determine sentiment counts
  const lowThreshold = 0.4;
  const mediumThreshold = 0.7;

  const sentimentCounts = chartData.reduce(
    (counts, { sentiment }) => {
      if (sentiment <= lowThreshold) {
        counts.low += 1;
      } else if (sentiment <= mediumThreshold) {
        counts.medium += 1;
      } else {
        counts.high += 1;
      }
      return counts;
    },
    { low: 0, medium: 0, high: 0 }
  );

  // Calculate average sentiment for current and previous period
  const currentPeriodAvg =
    chartData.reduce((sum, { sentiment }) => sum + sentiment, 0) /
    chartData.length;
  const previousPeriodAvg =
    chartData.length > 1
      ? chartData.slice(0, chartData.length - 1).reduce((sum, { sentiment }) => sum + sentiment, 0) /
        (chartData.length - 1)
      : currentPeriodAvg;

  // Determine trend text and icon based on average sentiment comparison
  let trendText = "Neutral trending this month";
  let trendIcon = <Circle className="h-4 w-4" />; // Fallback neutral icon

  if (currentPeriodAvg > previousPeriodAvg) {
    if (currentPeriodAvg <= lowThreshold) {
      trendText = "This period of time is better than the last but still shows unsatisfied employees.";
      trendIcon = <TrendingUp className="h-4 w-4" />;
    } else if (currentPeriodAvg <= mediumThreshold) {
      trendText = "This period of time shows improvement and is now moderately satisfied.";
      trendIcon = <TrendingUp className="h-4 w-4" />;
    } else {
      trendText = "This period shows significant improvement with mostly satisfied employees.";
      trendIcon = <TrendingUp className="h-4 w-4" />;
    }
  } else if (currentPeriodAvg < previousPeriodAvg) {
    if (currentPeriodAvg <= lowThreshold) {
      trendText = "This period of time is worse than the last with continued dissatisfaction.";
      trendIcon = <TrendingDown className="h-4 w-4" />;
    } else if (currentPeriodAvg <= mediumThreshold) {
      trendText = "This period of time shows a slight decline but is still moderately satisfied.";
      trendIcon = <TrendingDown className="h-4 w-4" />;
    } else {
      trendText = "This period shows a decline in satisfaction from the last.";
      trendIcon = <TrendingDown className="h-4 w-4" />;
    }
  }


  const chartConfig = {
    sentiment: {
      label: "Sentiment",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig
  return (
    <Card>
      <CardHeader>
        <CardTitle>Surveys</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="sentiment"
              type="natural"
              stroke="var(--color-sentiment)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-sentiment)",
              }}
              activeDot={{
                r: 6,
              }}
              
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
        {trendText} {trendIcon}
        </div>
        <div className="leading-none text-muted-foreground">
          {/* Showing total visitors for the last 6 months */}
        </div>
      </CardFooter>
    </Card>
  )
}
