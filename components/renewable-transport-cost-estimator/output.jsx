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

const RenewableTransportCostEstimatorOutput = ({
  estimatedTotalCost,
  vehicleCostEstimates,
  emissionReductions,
  recommendedVehicle,
  vehicleComparisonAnalysis,
  environmentalIncentives,
}) => {
  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Estimated Total Cost */}
      <Card>
        <CardHeader>
          <CardTitle>Estimated Total Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">${estimatedTotalCost}</p>
        </CardContent>
      </Card>

      {/* Recommended Vehicle */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{recommendedVehicle}</p>
        </CardContent>
      </Card>

      {/* Vehicle Cost Estimates */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Vehicle Cost Estimates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Name</TableHead>
                <TableHead>Energy Source</TableHead>
                <TableHead>Cost Estimate</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead>Environmental Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleCostEstimates.map((vehicle, index) => (
                <TableRow key={index}>
                  <TableCell>{vehicle.vehicleName}</TableCell>
                  <TableCell>{vehicle.energySource}</TableCell>
                  <TableCell>${vehicle.costEstimate}</TableCell>
                  <TableCell>{vehicle.efficiency}</TableCell>
                  <TableCell>{vehicle.environmentalImpact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

     

      {/* Side-by-Side Chart for Vehicle Comparison */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle Comparison Analysis */}
        <RenderChart chart={vehicleComparisonAnalysis} title="Vehicle Comparison Analysis" />
        <div className="flex flex-col gap-6">
             {/* Emission Reductions */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Emission Reductions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {Object.entries(emissionReductions).map(([key, value], index) => (
              <li key={index}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Environmental Incentives */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Environmental Incentives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {environmentalIncentives.map((incentive, index) => (
              <li key={index}>{incentive}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};

export default RenewableTransportCostEstimatorOutput;
