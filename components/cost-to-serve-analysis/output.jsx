import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import MarkdownRenderer from "../ui/markdown";
import RenderChart from "../common/renderChart";

const CostToServeAnalysisToolOutput = ({
  total_cost_to_serve,
  optimization_recommendations,
  strategic_insights,
  implementation_steps,
  risk_evaluation,
  final_recommendation,
  success_probability,
  potential_savings,
  customer_impact,
  charts,
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
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Cost to Serve</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              ${total_cost_to_serve.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Potential Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              ${potential_savings.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Success Probability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{success_probability}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Final Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{final_recommendation}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {charts.map((chart, index) => (
          <RenderChart
            key={index}
            chart={chart}
            title={`Analysis ${index + 1}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={optimization_recommendations} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategic Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={strategic_insights} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Implementation Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={implementation_steps} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Evaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={risk_evaluation} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Customer Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={customer_impact} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CostToServeAnalysisToolOutput;
