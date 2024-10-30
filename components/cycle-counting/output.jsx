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
import RenderChart from "../common/renderChart";

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
}) => {
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
        <RenderChart
          chart={discrepancyAnalysis}
          title="Discrepancy Analysis"
          index={1}
        />

        <RenderChart
          chart={priorityRecommendations}
          title="Priority Recommendation"
          index={1}
        />

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
        <RenderChart
          comparisonChart={stockLevelAnalysis}
          title="Stock Level Analysis"
        />

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
