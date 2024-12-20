import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import MarkdownRenderer from "../ui/markdown";
import RenderChart, { Plot } from "../common/renderChart";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  ListChecks,
  TrendingUp,
} from "lucide-react";
import { Progress } from "../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// Remove TypeScript interfaces and type annotations
// interface NamedPlot extends Plot {
//   name: string;
// }

// export interface SalesAndOperationsPlanningToolOutputProps {
//   recommended_inventory_levels: {
//     name: string;
//     quantity: number;
//   }[];
//   estimated_cost_savings_percentage: number;
//   expected_improvement_in_service_levels: {
//     percentage: number;
//     explanation: string;
//   };
//   key_performance_indicators: {
//     kpi_name: string;
//     current_value: number;
//     expected_improvement_percentage: number;
//   }[];
//   implementation_plan: string;
//   risk_analysis: string;
//   key_considerations: string[];
//   charts: NamedPlot[];
//   scenario_analysis?: string | null;
//   success_stories?: string | null;
//   overall_suggestion: string;
// }

const SalesAndOperationsPlanningToolOutput = ({
  recommended_inventory_levels,
  estimated_cost_savings_percentage,
  expected_improvement_in_service_levels,
  key_performance_indicators,
  implementation_plan,
  risk_analysis,
  key_considerations,
  charts,
  scenario_analysis,
  success_stories,
  overall_suggestion,
}) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Boxes />
              Recommended Inventory Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommended_inventory_levels.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-8">
          <Card className="w-full flex-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp />
                Estimated Cost Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600">
                {estimated_cost_savings_percentage}%
              </p>
            </CardContent>
          </Card>

          <Card className="w-full flex-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 />
                Expected Service Level Improvement
              </CardTitle>
              <CardDescription>
                {expected_improvement_in_service_levels.explanation}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-blue-600">
                {expected_improvement_in_service_levels.percentage}%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp />
            Key Performance Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>KPI Name</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>Expected Improvement</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {key_performance_indicators.map((kpi, index) => (
                <TableRow key={index}>
                  <TableCell>{kpi.kpi_name}</TableCell>
                  <TableCell>{kpi.current_value}</TableCell>
                  <TableCell>{kpi.expected_improvement_percentage}%</TableCell>
                  <TableCell>
                    <Progress
                      value={kpi.expected_improvement_percentage}
                      className="w-[60%]"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {charts.map((chart, index) => (
          <RenderChart
            key={index}
            chart={chart}
            title={chart.name}
            index={index}
          />
        ))}

        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 />
              Implementation Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={implementation_plan} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks />
              Key Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {key_considerations.map((consideration, index) => (
                <li key={index}>{consideration}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="flex-1 w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={risk_analysis} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={overall_suggestion} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesAndOperationsPlanningToolOutput;
