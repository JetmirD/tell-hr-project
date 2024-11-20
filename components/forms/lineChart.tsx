"use client"

import { TrendingUp } from "lucide-react"
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
          This period of time had more unsatisfied employees <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {/* Showing total visitors for the last 6 months */}
        </div>
      </CardFooter>
    </Card>
  )
}
