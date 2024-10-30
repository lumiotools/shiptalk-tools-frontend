import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, Package, Truck } from "lucide-react";
import RenderChart from "@/components/common/renderChart";

export default function Component({
  optimizedRoute,
  totalStops,
  highPriorityParcelCount,
  handlingRequirementSummary,
  highRiskStops,
  delayRiskAnalysis,
  travelComplexityAnalysis,
  priorityParcelImpact,
  handlingRequirementsDistribution,
  handlingCostEstimation,
  recommendations,
}) {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck  />
            Optimized Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sequence</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Parcel Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Handling Requirements</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimizedRoute.map((stop) => (
                <TableRow key={stop.sequenceOrder}>
                  <TableCell>{stop.sequenceOrder}</TableCell>
                  <TableCell>{stop.address}</TableCell>
                  <TableCell>{stop.parcelType}</TableCell>
                  <TableCell>{stop.priorityLevel}</TableCell>
                  <TableCell>{stop.handlingRequirements}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Route Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Stops: {totalStops}</p>
            <p>High Priority Parcels: {highPriorityParcelCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Handling Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {handlingRequirementSummary.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle  />
              High Risk Stops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {highRiskStops.map((stop, index) => (
                <li key={index}>{stop}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RenderChart 
        index={4}title="Delay Risk Analysis" chart={delayRiskAnalysis} />

        <RenderChart
        index={3}
          title="Travel Complexity Analysis"
          chart={travelComplexityAnalysis}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RenderChart
          title="Priority Parcel Impact"
          chart={priorityParcelImpact}
        />

        <RenderChart
        index={2}
          title="Handling Requirements Distribution"
          chart={handlingRequirementsDistribution}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RenderChart
        index={3}
          title="Handling Cost Estimation"
          chart={handlingCostEstimation}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package  />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
