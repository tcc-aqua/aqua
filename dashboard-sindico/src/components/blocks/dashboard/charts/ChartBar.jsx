"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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
  { month: "Janeiro", novos: 12 },
  { month: "Fevereiro", novos: 18 },
  { month: "Março", novos: 9 },
  { month: "Abril", novos: 15 },
  { month: "Maio", novos: 11 },
  { month: "Junho", novos: 16 },
]

const chartConfig = {
  novos: {
    label: "Novos Moradores",
    color: "var(--chart-1)",
  },
}

export function ChartBarLabel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Novos Moradores</CardTitle>
        <CardDescription>Total registrado mês a mês</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Bar dataKey="novos" fill="var(--color-novos)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Histórico dos últimos 6 meses
        </div>
      </CardFooter>
    </Card>
  )
}
