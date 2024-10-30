import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import MarkdownRenderer from "../ui/markdown";
import RenderChart from "../common/renderChart";
import { TrendingDown, Clock, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const DeliveryFrequencyCostImpactAnalyzerOutput = ({
  frequencyCostBreakdown,
  optimalFrequency,
  totalCostEstimation,
  savingsEstimation,
  frequencyCostAnalysis,
  savingsPotentialAnalysis,
  averageCostPerParcelTrend,
  distanceCoverageAnalysis,
  recommendations,
  keyInsights,
  financialSummary,
  urgencyImpactAssessment,
}) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign />
              Total Cost Estimation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              ${totalCostEstimation}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingDown />
              Savings Estimation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">
              ${savingsEstimation}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock />
              Optimal Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-purple-600">
              {optimalFrequency} Delivery/Week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequency Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Frequency</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Cost Difference</TableHead>
                <TableHead>Savings Potential</TableHead>
                <TableHead>Average Cost per Parcel</TableHead>
                <TableHead>Total Distance Covered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {frequencyCostBreakdown.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.frequency}</TableCell>
                  <TableCell>${item.totalCost}</TableCell>
                  <TableCell>${item.costDifference}</TableCell>
                  <TableCell>${item.savingsPotential}</TableCell>
                  <TableCell>${item.averageCostPerParcel}</TableCell>
                  <TableCell>{item.totalDistanceCovered} km</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <RenderChart
          index={4}
          title="Frequency Cost Analysis"
          chart={frequencyCostAnalysis}
        />
        <RenderChart
          index={2}
          title="Savings Potential Analysis"
          chart={savingsPotentialAnalysis}
        />
        <RenderChart
          index={3}
          title="Average Cost / Parcel Trend"
          chart={averageCostPerParcelTrend}
        />
        <RenderChart
          index={1}
          title="Distance Coverage Analysis"
          chart={distanceCoverageAnalysis}
        />

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {keyInsights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Weekly Savings: ${financialSummary.weeklySavings}</p>
          <p>Monthly Savings: ${financialSummary.monthlySavings}</p>
          <p>Annual Savings: ${financialSummary.annualSavings}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Urgency Impact Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Urgency Level</TableHead>
                <TableHead>Suggested Frequency</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urgencyImpactAssessment.map((assessment, index) => (
                <TableRow key={index}>
                  <TableCell>{assessment.urgencyLevel}</TableCell>
                  <TableCell>{assessment.suggestedFrequency}</TableCell>
                  <TableCell>{assessment.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryFrequencyCostImpactAnalyzerOutput;
