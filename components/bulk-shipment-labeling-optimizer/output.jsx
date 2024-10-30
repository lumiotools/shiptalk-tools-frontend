import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RenderChart from "@/components/common/renderChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BulkShipmentLabelingOptimizerOutput = ({
  carrierLabelRequirements,
  packagingRecommendations,
  labelCostEstimate,
  complianceWarnings,
  bulkLabelCostComparison,
  durabilityImpactAnalysis,
  labelingEfficiencyTips,
  seasonalAdjustmentRecommendations,
  operationalEfficiencyScore,
}) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Carrier Label Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Carrier Label Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold">Mandatory Fields:</p>
            <ul className="list-disc pl-6">
              {carrierLabelRequirements.mandatoryFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
            <p>Label Size: {carrierLabelRequirements.labelSize}</p>
            <p>Placement Note: {carrierLabelRequirements.placementNote}</p>
          </CardContent>
        </Card>

        {/* Packaging Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Packaging Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Adhesion Level</TableHead>
                  <TableHead>Recommended Label Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packagingRecommendations.map((rec, index) => (
                  <TableRow key={index}>
                    <TableCell>{rec.material}</TableCell>
                    <TableCell>{rec.adhesionLevel}</TableCell>
                    <TableCell>{rec.recommendedLabelType}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Label Cost Estimate */}
        <Card>
          <CardHeader>
            <CardTitle>Label Cost Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Material Type: {labelCostEstimate.materialType}</p>
            <p>Cost Per Label: ${labelCostEstimate.costPerLabel}</p>
            <p>Discount Applied: {labelCostEstimate.discountApplied}%</p>
            <p>Total Cost: ${labelCostEstimate.totalCost}</p>
          </CardContent>
        </Card>

        {/* Compliance Warnings */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Shipping Type: {complianceWarnings.shippingType}</p>
            <ul>
              {complianceWarnings.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Bulk Label Cost Comparison Chart */}
        <RenderChart
          index={2}
          chart={bulkLabelCostComparison}
          title="Bulk Label Cost Comparison"
        />

        {/* Durability Impact Analysis Chart */}
        <RenderChart
          index={4}
          chart={durabilityImpactAnalysis}
          title="Durability Impact Analysis"
        />

        {/* Labeling Efficiency Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Labeling Efficiency Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {labelingEfficiencyTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Seasonal Adjustment Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Adjustment Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{seasonalAdjustmentRecommendations}</p>
          </CardContent>
        </Card>
      </div>
      {/* Operational Efficiency Score */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Efficiency Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{operationalEfficiencyScore}%</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkShipmentLabelingOptimizerOutput;
