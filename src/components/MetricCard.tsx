import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { cn } from "../lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: React.ReactNode;
  description?: string;
  colorClass?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  icon,
  description,
  colorClass = "text-blue-600",
}: MetricCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", colorClass)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end space-x-1">
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground mb-1">{unit}</div>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
