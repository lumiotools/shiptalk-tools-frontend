import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Progress } from "../ui/progress";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Droplet,
  Gauge,
  RefreshCcw,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface CycleCountingToolPlot {
  xLabel: string;
  yLabel: string;
  chartType: string;
  data: {
    label: string;
    value: number;
  }[];
  explanation: string;
}

interface CycleCountingToolComparisonPlot {
  xLabel: string;
  yLabel: string;
  yActualLabel: string;
  yComparedLabel: string;
  chartType: string;
  actualData: {
    label: string;
    value: number;
  }[];
  comparedData: {
    label: string;
    value: number;
  }[];
  explanation: string;
}

interface CycleCountingToolFrequency {
  label: string;
  value: number;
  explanation: string;
}

interface CycleCountingToolRiskAssessment {
  riskLevel: string;
  riskProgress: number;
  explanation: string;
}

export interface CycleCountingToolOutputProps {
  discrepancyAnalysis: CycleCountingToolPlot;
  cycleCountFrequencySuggestion: CycleCountingToolFrequency;
  inventoryRiskAssessment: CycleCountingToolRiskAssessment;
  priorityRecommendations: CycleCountingToolPlot;
  cycleCountEfficiency: CycleCountingToolFrequency;
  nextCycleCountPeriod: string;
  replenishmentSuggestion: string;
  stockLevelAnalysis: CycleCountingToolComparisonPlot;
  accuracyImprovementSuggestions: string;
  processStreamliningSuggestions: string;
}

const CycleCountingToolOutput = ({
  discrepancyAnalysis,
  cycleCountFrequencySuggestion,
  inventoryRiskAssessment,
  priorityRecommendations,
  cycleCountEfficiency,
  nextCycleCountPeriod,
  replenishmentSuggestion,
  stockLevelAnalysis,
  accuracyImprovementSuggestions,
  processStreamliningSuggestions,
}: CycleCountingToolOutputProps) => {
  const COLORS = [
    "#8884d8",
    "#00C49F",
    "#0088FE",
    "#FF8042",
    "#00C49F",
    "#FFBB28",
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Discrepancy Analysis</CardTitle>
            <CardDescription>{discrepancyAnalysis.explanation}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: discrepancyAnalysis.yLabel,
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={discrepancyAnalysis.data}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Recommendation</CardTitle>
            <CardDescription>
              {priorityRecommendations.explanation}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: priorityRecommendations.xLabel,
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityRecommendations.data}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="var(--color-value)"
                    label
                    labelLine={false}
                  >
                    {priorityRecommendations.data.map((entry, index) => (
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Risk Assessment</CardTitle>
            <CardDescription>
              {inventoryRiskAssessment.explanation}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Gauge className="h-6 w-6 text-yellow-500" />
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium">
                  Risk Level: {inventoryRiskAssessment.riskLevel}
                </p>
                <Progress
                  value={inventoryRiskAssessment.riskProgress}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cycle Count Efficiency</CardTitle>
            <CardDescription>
              {cycleCountEfficiency.explanation}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Zap className="h-6 w-6 text-blue-500" />
              <div className="space-y-2 flex-1">
                <p className="text-sm font-medium">
                  {cycleCountEfficiency.label}: {cycleCountEfficiency.value}%
                </p>
                <Progress
                  value={cycleCountEfficiency.value}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Level Analysis</CardTitle>
            <CardDescription>{stockLevelAnalysis.explanation}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <ChartContainer
              config={{
                value: {
                  label: stockLevelAnalysis.yLabel,
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockLevelAnalysis.data}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer> */}

            <ChartContainer className="h-[300px]" config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                {stockLevelAnalysis.actualData &&
                stockLevelAnalysis.actualData.length > 0 ? (
                  <BarChart
                    data={stockLevelAnalysis.actualData.map(
                      ({ label, value }, index) => ({
                        label,
                        actualValue: value,
                        comparedValue:
                          stockLevelAnalysis.comparedData[index].value,
                      })
                    )}
                  >
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-background p-2 rounded shadow">
                              <p className="font-semibold">{label}</p>
                              <p>{`${payload[0].name}: ${payload[0].value}`}</p>
                              <p>{`${payload[1].name}: ${payload[1].value}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="actualValue"
                      name={stockLevelAnalysis.yActualLabel}
                      fill="hsl(var(--chart-2))"
                    />
                    <Bar
                      dataKey="comparedValue"
                      name={stockLevelAnalysis.yComparedLabel}
                      fill="hsl(var(--chart-3))"
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cycle Count Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <RefreshCcw className="h-5 w-5 text-muted-foreground" />
              <p>
                <strong>Next Cycle Count:</strong> {nextCycleCountPeriod}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <p>
                <strong>Frequency Adjustment:</strong>{" "}
                {cycleCountFrequencySuggestion.value}%
              </p>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Suggestion</AlertTitle>
              <AlertDescription>
                {cycleCountFrequencySuggestion.explanation}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Improvement Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <BarChart3 className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <p>
              <strong>Accuracy Improvement:</strong>{" "}
              {accuracyImprovementSuggestions}
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Zap className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <p>
              <strong>Process Streamlining:</strong>{" "}
              {processStreamliningSuggestions}
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <Droplet className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <p>
              <strong>Replenishment Suggestion:</strong>{" "}
              {replenishmentSuggestion}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CycleCountingToolOutput;
