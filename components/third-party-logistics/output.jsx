import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import MarkdownRenderer from "../ui/markdown";
import RenderChart, { ComparisonPlot, Plot } from "../common/renderChart";
import {
  AlertTriangle,
  Boxes,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  List,
  ListChecks,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
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

const ThirdPartyLogisticsToolOutput = ({
  suggested_providers,
  estimated_cost_savings_percentage,
  expected_improvement_in_service_levels,
  key_performance_indicators,
  implementation_plan,
  risk_analysis,
  key_considerations,
  charts,
  success_stories,
  overall_suggestion,
}) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2  />
              Suggested 3PL Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {suggested_providers.map((provider, index) => (
                <li key={index}>{provider}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown  />
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
            <CardTitle className="flex items-center">
              <Clock  />
              Service Level Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {expected_improvement_in_service_levels}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ThumbsUp  />
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
            <CardTitle className="flex items-center">
              <CheckCircle2  />
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
              <AlertTriangle  />
              Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={risk_analysis} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks  />
              Key Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={key_considerations} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Success Stories</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer markdownText={success_stories} />
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Overall Suggestion</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer markdownText={overall_suggestion} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ThirdPartyLogisticsToolOutput;
