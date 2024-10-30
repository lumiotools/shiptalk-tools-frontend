import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltipContent } from "../ui/chart";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Progress } from "../ui/progress";
import MarkdownRenderer from "../ui/markdown";
import { RiskBadge, StatusBadge, TrafficSensitivityBadge } from "./badges";
import { CloudSnow, Truck } from "lucide-react";

const DynamicRoutingToolOutput = ({
  deliveryTimeComparison,
  conditionImpactChart,
  priorityBasedRecommendation,
  riskLevel,
  riskProgress,
  riskExplanation,
  delayImpactAnalysis,
  deliveryStatus,
  deliveryStatusExplanation,
  trafficSensitivity,
  weatherImpactAssessment,
  priorityAdjustmentSuggestions,
}) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-full">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center">
              Delivery Analysis
            </CardTitle>
            <CardDescription className="flex items-center">
              <Truck className="mr-2 h-4 w-4" />
              Current delivery status: <StatusBadge status={deliveryStatus} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer
              className="text-muted-foreground"
              markdownText={deliveryStatusExplanation}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Time Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: deliveryTimeComparison.yLabel,
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryTimeComparison.data} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="label" type="category" width={150} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <MarkdownRenderer
              className="text-muted-foreground"
              markdownText={deliveryTimeComparison.explanation}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Condition Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: conditionImpactChart.xLabel,
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conditionImpactChart.data}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="value"
                    name={conditionImpactChart.yLabel}
                    fill="var(--color-value)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <MarkdownRenderer
              className="text-muted-foreground"
              markdownText={conditionImpactChart.explanation}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Based Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: priorityBasedRecommendation.xLabel,
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityBasedRecommendation.data}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="var(--color-value)"
                    label
                    labelLine={false}
                  >
                    {priorityBasedRecommendation.data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <MarkdownRenderer
              className="text-muted-foreground"
              markdownText={priorityBasedRecommendation.explanation}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delay Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Impact (%)", color: "hsl(var(--chart-4))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={delayImpactAnalysis}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Risk Level
              <RiskBadge level={riskLevel} />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={riskProgress} className="w-full" />
            <MarkdownRenderer markdownText={riskExplanation} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Traffic Sensitivity
              <TrafficSensitivityBadge level={trafficSensitivity.level} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={trafficSensitivity.explanation} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CloudSnow className="mr-2 h-5 w-5" />
              Weather Impact Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={weatherImpactAssessment} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Adjustment Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={priorityAdjustmentSuggestions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DynamicRoutingToolOutput;
