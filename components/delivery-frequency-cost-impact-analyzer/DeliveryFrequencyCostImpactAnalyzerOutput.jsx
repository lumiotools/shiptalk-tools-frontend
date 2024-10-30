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
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
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
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
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
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
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
        <RenderChart chart={frequencyCostAnalysis} />
        <RenderChart chart={savingsPotentialAnalysis} />
        <RenderChart chart={averageCostPerParcelTrend} />
        <RenderChart chart={distanceCoverageAnalysis} />
      </div>

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

      <Card>
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
