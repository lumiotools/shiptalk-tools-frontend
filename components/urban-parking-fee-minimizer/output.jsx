import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, DollarSign, Clock } from "lucide-react"
import RenderChart from "@/components/common/renderChart"

export default function Component({
  totalEstimatedParkingCost,
  parkingCostAnalysis,
  trafficAnalysis,
  loadingZoneInfo,
  permitRecommendations,
  seasonalEventImpact,
  parkingFeeComparison,
  congestionImpactAnalysis,
}) {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign  />
            Total Estimated Parking Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${totalEstimatedParkingCost.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
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
              {parkingCostAnalysis.map((analysis, index) => (
                <TableRow key={index}>
                  <TableCell>{analysis.location}</TableCell>
                  <TableCell>{analysis.zoneType}</TableCell>
                  <TableCell>${analysis.estimatedParkingCost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock  />
            Traffic Analysis
          </CardTitle>
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
              {trafficAnalysis.map((analysis, index) => (
                <TableRow key={index}>
                  <TableCell>{analysis.location}</TableCell>
                  <TableCell>{analysis.congestionLevel}</TableCell>
                  <TableCell>{analysis.suggestedTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Loading Zone Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{loadingZoneInfo}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Permit Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {permitRecommendations.map((permit, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-semibold">{permit.permitType}</h4>
              <p>Applicable Zones: {permit.applicableZones.join(", ")}</p>
              <p>Cost: {permit.cost}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle  />
            Seasonal Event Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{seasonalEventImpact}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RenderChart
          title="Parking Fee Comparison"
          chart={parkingFeeComparison}
        />

        <RenderChart
          title="Congestion Impact Analysis"
          chart={congestionImpactAnalysis}
        />
      </div>
    </div>
  )
}