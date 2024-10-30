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

const UrbanParkingFeeMinimizerOutput = ({
  totalEstimatedParkingCost,
  parkingCostAnalysis,
  trafficAnalysis,
  loadingZoneInfo,
  permitRecommendations,
  seasonalEventImpact,
  parkingFeeComparison,
  congestionImpactAnalysis,
}) => {
  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Total Estimated Parking Cost */}
      <Card>
        <CardHeader>
          <CardTitle>Total Estimated Parking Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">${totalEstimatedParkingCost}</p>
        </CardContent>
      </Card>

      {/* Parking Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Parking Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Zone Type</TableHead>
                <TableHead>Estimated Parking Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parkingCostAnalysis.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.zoneType}</TableCell>
                  <TableCell>${item.estimatedParkingCost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Traffic Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Congestion Level</TableHead>
                <TableHead>Suggested Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trafficAnalysis.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.congestionLevel}</TableCell>
                  <TableCell>{item.suggestedTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Loading Zone Information */}
      <Card>
        <CardHeader>
          <CardTitle>Loading Zone Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{loadingZoneInfo}</p>
        </CardContent>
      </Card>

      {/* Permit Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Permit Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permit Type</TableHead>
                <TableHead>Applicable Zones</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permitRecommendations.map((permit, index) => (
                <TableRow key={index}>
                  <TableCell>{permit.permitType}</TableCell>
                  <TableCell>{permit.applicableZones.join(", ")}</TableCell>
                  <TableCell>{permit.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Seasonal Event Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Seasonal Event Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{seasonalEventImpact}</p>
        </CardContent>
      </Card>

      {/* Parking Fee Comparison Chart */}
      <RenderChart chart={parkingFeeComparison} title="Parking Fee Comparison" />

      {/* Congestion Impact Analysis Chart */}
      <RenderChart chart={congestionImpactAnalysis} title="Congestion Impact Analysis" />
    </div>
  );
};

export default UrbanParkingFeeMinimizerOutput;
