import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { WeatherDataPoint } from "../types";

interface DataChartProps {
  title: string;
  data: WeatherDataPoint[];
  color: string;
  unit: string;
  valueFormatter?: (value: number) => string;
}

export function DataChart({
  title,
  data,
  color,
  unit,
  valueFormatter = (value) => `${value}`,
}: DataChartProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                padding={{ left: 10, right: 10 }}
                tickMargin={5}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={valueFormatter}
                padding={{ top: 10, bottom: 10 }}
                tickMargin={5}
                domain={["dataMin - 5", "dataMax + 5"]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {title}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {valueFormatter(payload[0].value as number)}
                              {unit}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Horário
                            </span>
                            <span className="font-bold">
                              {payload[0].payload.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fillOpacity={1}
                fill={`url(#gradient-${title})`}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
