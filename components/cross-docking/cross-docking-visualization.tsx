"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CrossDockingResponse {
  tool: string;
  response: {
    carrierOptimization: {
      xLabel: string;
      yLabel: string;
      chartType: "barChart";
      data: {
        label: string;
        value: number;
      }[];
      explanation: string;
    };
    dockScheduling: string;
    laborAllocation: {
      xLabel: string;
      yLabel: string;
      chartType: "pieChart";
      data: {
        label: string;
        value: number;
      }[];
      explanation: string;
    };
    riskAssessment: {
      riskLevel: string;
      riskProgress: number;
      explanation: string;
    };
    deliveryTimelineComparison: {
      xLabel: string;
      yLabel: string;
      yActualLabel: string;
      yComparedLabel: string;
      chartType: "lineChart";
      actualData: {
        label: string;
        value: number;
      }[];
      comparedData: {
        label: string;
        value: number;
      }[];
      explanation: string;
    };
    deliveryStatus: {
      status: string;
      explanation: string;
    };
    costEfficiency: {
      laborEfficiency: string;
      dockUtilization: string;
      truckCapacityUtilization: string;
    };
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-2 rounded shadow-md">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

export default function Component({ data }: { data: CrossDockingResponse }) {
  const { response } = data;

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Cross Docking Optimization Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Carrier Optimization</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={response.carrierOptimization.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis
                    label={{
                      value: response.carrierOptimization.yLabel,
                      angle: -90,
                      position: "center",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-4 text-sm">
                {response.carrierOptimization.explanation}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Dock Scheduling</h3>
              <p className="text-sm">{response.dockScheduling}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Labor Allocation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={response.laborAllocation.data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {response.laborAllocation.data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="mt-4 text-sm">
                {response.laborAllocation.explanation}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Risk Assessment</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="font-medium">
                  {response.riskAssessment.riskLevel}
                </div>
                <Progress
                  value={response.riskAssessment.riskProgress}
                  className="w-full border-2"
                />
              </div>
              <p className="text-sm">{response.riskAssessment.explanation}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">
                Delivery Timeline Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis
                    label={{
                      value: response.deliveryTimelineComparison.yLabel,
                      angle: -90,
                      position: "center",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    data={response.deliveryTimelineComparison.actualData}
                    name={response.deliveryTimelineComparison.yActualLabel}
                    stroke="#8884d8"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    data={response.deliveryTimelineComparison.comparedData}
                    name={response.deliveryTimelineComparison.yComparedLabel}
                    stroke="#ffff"
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-4 text-sm">
                {response.deliveryTimelineComparison.explanation}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Delivery Status</h3>
              <div className="font-medium mb-2">
                Status: {response.deliveryStatus.status}
              </div>
              <p className="text-sm">{response.deliveryStatus.explanation}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Cost Efficiency</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  Labor Efficiency: {response.costEfficiency.laborEfficiency}
                </li>
                <li>
                  Dock Utilization: {response.costEfficiency.dockUtilization}
                </li>
                <li>
                  Truck Capacity Utilization:{" "}
                  {response.costEfficiency.truckCapacityUtilization}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
