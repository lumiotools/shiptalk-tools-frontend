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
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Progress } from "../ui/progress";
import MarkdownRenderer from "../ui/markdown";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BarChartIcon,
  BookOpen,
  DollarSign,
  Droplet,
  Flag,
  Gauge,
  Lightbulb,
  LineChartIcon,
  List,
  PieChartIcon,
  RefreshCcw,
  Target,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CostToServeAnalysisRenderChart } from "./renderChart";

interface CostToServeAnalysisToolPlot {
  xLabel: string;
  yLabel: string;
  chartType: string;
  data: {
    label: string;
    value: number;
  }[];
  explanation: string;
}

interface CostToServeAnalysisToolCostBreakdown {
  Manufacturing: number;
  Warehousing: number;
  Delivery: number;
}

export interface CostToServeAnalysisToolOutputProps {
  total_cost_to_serve: number;
  cost_breakdown: CostToServeAnalysisToolCostBreakdown;
  profit_margins: object;
  optimization_recommendations: string[];
  strategic_insights: string[];
  visualizations: CostToServeAnalysisToolPlot[];
  implementation_steps: string[];
  risk_evaluation: string[];
  case_examples: string;
  final_recommendation: string;
}

const CostToServeAnalysisToolOutput = ({
  total_cost_to_serve,
  cost_breakdown,
  profit_margins,
  optimization_recommendations,
  strategic_insights,
  visualizations,
  implementation_steps,
  risk_evaluation,
  case_examples,
  final_recommendation,
}: CostToServeAnalysisToolOutputProps) => {
  const COLORS = [
    "#8884d8",
    "#00C49F",
    "#0088FE",
    "#FF8042",
    "#00C49F",
    "#FFBB28",
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Cost Analysis Dashboard</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            Total Cost to Serve: ${total_cost_to_serve.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            Overview of cost-to-serve and profit margins
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Cost Breakdown</CardTitle>
          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {Object.entries(cost_breakdown).map(([key, value]) => (
              <li
                key={key}
                className="flex items-center justify-between text-sm"
              >
                <span>{key}:</span>
                <span className="font-medium">${value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Profit Margins</CardTitle>
          <BarChartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {Object.entries(profit_margins).map(([key, value]) => (
              <li
                key={key}
                className="flex items-center justify-between text-sm"
              >
                <span>{key}:</span>
                <span className="font-medium">${value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Optimization Recommendations</CardTitle>
          <Lightbulb className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-1 text-sm">
            {optimization_recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Strategic Insights</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-1 text-sm">
            {strategic_insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {visualizations.map((visualization, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
              {visualization.xLabel} vs {visualization.yLabel}
            </CardTitle>
            {visualization.chartType === "bar" && (
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            )}
            {visualization.chartType === "pie" && (
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            )}
            {visualization.chartType === "line" && (
              <LineChartIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </CardHeader>
          <CardContent>
            <CostToServeAnalysisRenderChart {...visualization} />
            <p className="text-xs text-muted-foreground mt-2">
              {visualization.explanation}
            </p>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Implementation Steps</CardTitle>
          <List className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-4 space-y-1 text-sm">
            {implementation_steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Risk Evaluation</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-1 text-sm">
            {risk_evaluation.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {case_examples && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Case Example</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm">{case_examples}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Final Recommendation</CardTitle>
          <Flag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p>{final_recommendation}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostToServeAnalysisToolOutput;
