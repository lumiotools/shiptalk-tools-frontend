"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  label: string;
  value: number;
};

type Chart = {
  xLabel: string;
  yLabel: string;
  chartType: "barChart" | "lineChart";
  data: ChartData[];
  explanation: string;
};

type SeasonalPlanningData = {
  tool: string;
  response: {
    inventory_adjustments: Record<string, number>;
    staffing_recommendations: {
      current_staff: number;
      proposed_increase: number;
      total_staff_needed: number;
    };
    logistics_recommendations: {
      current_daily_shipments: string;
      total_needed_capacity: string;
    };
    estimated_cost_impact: number;
    potential_risks: string[];
    mitigation_strategies: string[];
    implementation_plan: string[];
    charts: Chart[];
    summary: string;
  };
};

interface SeasonalPlanningDashboardProps {
  data: SeasonalPlanningData;
}

export default function SeasonalPlanningDashboard({
  data,
}: SeasonalPlanningDashboardProps) {
  const { response } = data;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Seasonal Planning Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{response.summary}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Adjustments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Adjusted Inventory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(response.inventory_adjustments).map(
                  ([product, adjustment]) => (
                    <TableRow key={product}>
                      <TableCell>{product}</TableCell>
                      <TableCell>{adjustment}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staffing Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Current Staff</TableCell>
                  <TableCell>
                    {response.staffing_recommendations.current_staff}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Proposed Increase</TableCell>
                  <TableCell>
                    {response.staffing_recommendations.proposed_increase}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Total Staff Needed</TableCell>
                  <TableCell>
                    {response.staffing_recommendations.total_staff_needed}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logistics Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Current Daily Shipments:{" "}
            {response.logistics_recommendations.current_daily_shipments}
          </p>
          <p>
            Total Needed Capacity:{" "}
            {response.logistics_recommendations.total_needed_capacity}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estimated Cost Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            ${response.estimated_cost_impact.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Potential Risks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {response.potential_risks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mitigation Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {response.mitigation_strategies.map((strategy, index) => (
              <li key={index}>{strategy}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5">
            {response.implementation_plan.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {response.charts.map((chart, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{chart.yLabel}</CardTitle>
            <CardDescription>{chart.explanation}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                current: {
                  label: "Current",
                  color: "hsl(var(--chart-1))",
                },
                adjusted: {
                  label: "Adjusted",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                {chart.chartType === "barChart" ? (
                  <BarChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" fill="var(--color-current)" />
                  </BarChart>
                ) : (
                  <LineChart data={chart.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="var(--color-current)"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
