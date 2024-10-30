import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import MarkdownRenderer from "../ui/markdown";
import RenderChart from "../common/renderChart";

const SeasonalPlanningToolOutput = ({
  estimated_cost_impact,
  cost_breakdown,
  potential_risks,
  mitigation_strategies,
  implementation_plan,
  charts,
  summary,
}) => {
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estimated Cost Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-primary">
            ${estimated_cost_impact.toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charts.map((chart, index) => (
          <RenderChart
            key={index}
            chart={chart}
            title={`Analysis ${index + 1}`}
          />
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {cost_breakdown.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.label}</span>
                  <span className="font-semibold">
                    ${item.cost.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Potential Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={potential_risks} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mitigation Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={mitigation_strategies} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Implementation Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={implementation_plan} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer markdownText={summary} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonalPlanningToolOutput;
