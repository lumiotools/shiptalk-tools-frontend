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

const ColdChainDeliveryCostEstimatorOutput = ({
  packagingRecommendations,
  carrierCostEstimate,
  totalDeliveryCost,
  weatherImpactAssessment,
  costBreakdownChart,
  environmentalRiskLevel,
  handlingRecommendations,
  estimatedDeliveryTime,
  temperatureDeviationRisk,
  packagingCostEfficiencyChart,
  seasonalAdjustmentRecommendations,
}) => {
  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Total Delivery Cost */}
      <Card>
        <CardHeader>
          <CardTitle>Total Estimator Delivery Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">${totalDeliveryCost}</p>
        </CardContent>
      </Card>

      {/* Environmental Risk Level */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Risk Level</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{environmentalRiskLevel}</p>
        </CardContent>
      </Card>

      {/* Packaging Recommendations */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Packaging Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Specifications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packagingRecommendations.map((packageItem, index) => (
                <TableRow key={index}>
                  <TableCell>{packageItem.name}</TableCell>
                  <TableCell>${packageItem.cost}</TableCell>
                  <TableCell>
                    {packageItem.specifications.map((spec, idx) => (
                      <p key={idx}>
                        {spec.name}: {spec.value}
                      </p>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Carrier Cost Estimate */}
      <Card>
        <CardHeader>
          <CardTitle>Carrier Cost Estimate</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Name: {carrierCostEstimate.name}</p>
          <p>Rating: {carrierCostEstimate.rating}</p>
          <p>Cost Premium: {carrierCostEstimate.costPremium}</p>
          <ul>
            {carrierCostEstimate.capabilities.map((capability, index) => (
              <li key={index}>{capability}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Handling Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Handling Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {handlingRecommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Estimated Delivery Time */}
      <Card>
        <CardHeader>
          <CardTitle>Estimated Delivery Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{estimatedDeliveryTime}</p>
        </CardContent>
      </Card>

      {/* Temperature Deviation Risk */}
      <Card>
        <CardHeader>
          <CardTitle>Temperature Deviation Risk</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{temperatureDeviationRisk}</p>
        </CardContent>
      </Card>

      {/* Weather Impact Assessment */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Weather Impact Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{weatherImpactAssessment}</p>
        </CardContent>
      </Card>

      {/* Seasonal Adjustment Recommendations */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Seasonal Adjustment Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{seasonalAdjustmentRecommendations}</p>
        </CardContent>
      </Card>

      {/* Side-by-Side Charts */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Breakdown Chart */}
        <RenderChart chart={costBreakdownChart} title="Cost Breakdown" />

        {/* Packaging Cost Efficiency Chart */}
        <RenderChart chart={packagingCostEfficiencyChart} title="Packaging Cost Efficiency" />
      </div>
    </div>
  );
};

export default ColdChainDeliveryCostEstimatorOutput;
