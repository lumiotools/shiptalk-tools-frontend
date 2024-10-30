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
import { AlertTriangle, Clock, Truck } from "lucide-react";
import RenderChart from "@/components/common/renderChart";

export default function Component({
  optimalDeliveryWindows,
  carrierOptions,
  transitImpactSummary,
  peakTimeAnalysis,
  carrierEfficiencyComparison,
  seasonalImpactPrediction,
  peakSeasonDelayEstimate,
  timeZoneSpecificRegulations,
  recommendedDeliveryDateAdjustment,
  trafficImpactAnalysis,
  holidaySeasonAlerts,
  deliverySuccessProbability,
}) {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Optimal Delivery Windows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time Window</TableHead>
                <TableHead>Peak Time</TableHead>
                <TableHead>Business Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimalDeliveryWindows.map((window, index) => (
                <TableRow key={index}>
                  <TableCell>{window.timeWindow}</TableCell>
                  <TableCell>{window.peakTime ? "Yes" : "No"}</TableCell>
                  <TableCell>{window.businessHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Carrier Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Delivery Time Estimate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carrierOptions.map((carrier, index) => (
                  <TableRow key={index}>
                    <TableCell>{carrier.name}</TableCell>
                    <TableCell>{carrier.deliveryTimeEstimate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transit Impact Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{transitImpactSummary}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RenderChart index={2} title="Peak Time Analysis" chart={peakTimeAnalysis} />

        <RenderChart
        index={3} 
          title="Carrier Efficiency Comparison"
          chart={carrierEfficiencyComparison}
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seasonal Impact Prediction</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{seasonalImpactPrediction}</p>
          <p className="mt-2">
            <strong>Peak Season Delay Estimate:</strong>{" "}
            {peakSeasonDelayEstimate}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Traffic Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{trafficImpactAnalysis}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Zone Specific Regulations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {timeZoneSpecificRegulations.map((regulation, index) => (
                <li key={index}>{regulation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Date Adjustment</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{recommendedDeliveryDateAdjustment}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Holiday Season Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {holidaySeasonAlerts.map((alert, index) => (
                <li key={index}>{alert}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Success Probability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{deliverySuccessProbability}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
