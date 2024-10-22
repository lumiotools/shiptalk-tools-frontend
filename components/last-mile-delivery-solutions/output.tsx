import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import MarkdownRenderer from "../ui/markdown";
import RenderChart, { Plot } from "../common/renderChart";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ThumbsUp,
  TrendingDown,
  Truck,
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

export interface LastMileDeliverySolutionsToolOutputProps {
  suggested_carriers: string[];
  estimated_cost_savings_percentage: number;
  expected_delivery_time_reduction_percentage: number;
  key_performance_indicators: {
    kpi_name: string;
    current_value: number;
    expected_improvement_percentage: number;
  }[];
  implementation_plan: string;
  risk_analysis: string;
  overall_suggestion: string;
  charts: Plot[];
  success_stories: string;
}

const LastMileDeliverySolutionsToolOutput = ({
  suggested_carriers,
  estimated_cost_savings_percentage,
  expected_delivery_time_reduction_percentage,
  key_performance_indicators,
  implementation_plan,
  risk_analysis,
  overall_suggestion,
  charts,
  success_stories,
}: LastMileDeliverySolutionsToolOutputProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Suggested Carriers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {suggested_carriers.map((carrier, index) => (
                <li key={index}>{carrier}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Estimated Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              {estimated_cost_savings_percentage}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Expected Delivery Time Reduction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">
              {expected_delivery_time_reduction_percentage}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {charts.map((chart, index) => (
          <RenderChart key={index} chart={chart} index={index} />
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={risk_analysis} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Implementation Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={implementation_plan} />
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

        <Card>
          <CardHeader>
            <CardTitle>Success Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={success_stories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LastMileDeliverySolutionsToolOutput;
