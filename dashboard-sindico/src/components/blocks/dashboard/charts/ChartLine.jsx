"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

// Dados reais simulados — você depois puxa da API
const chartData = [
  { month: "Janeiro", vazamentos: 4, consumo_alto: 12 },
  { month: "Fevereiro", vazamentos: 2, consumo_alto: 9 },
  { month: "Março", vazamentos: 6, consumo_alto: 14 },
  { month: "Abril", vazamentos: 3, consumo_alto: 10 },
  { month: "Maio", vazamentos: 5, consumo_alto: 13 },
  { month: "Junho", vazamentos: 7, consumo_alto: 15 },
]

// Cores do shadcn/ui
const chartConfig = {
  vazamentos: {
    label: "Vazamentos",
    color: "var(--chart-1)",
  },
  consumo_alto: {
    label: "Consumo Alto",
    color: "var(--chart-2)",
  },
}

export function ChartLineMultiple() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vazamentos × Consumo Alto</CardTitle>
        <CardDescription>Comparativo dos últimos 6 meses</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Line
              dataKey="vazamentos"
              type="monotone"
              stroke="var(--color-vazamentos)"
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey="consumo_alto"
              type="monotone"
              stroke="var(--color-consumo_alto)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">

            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Dados dos últimos 6 meses.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
