import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, Truck } from "lucide-react";
import RenderChart from "@/components/common/renderChart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ParcelClimateProtectionOutput = ({
  climateRiskAssessment,
  packagingRecommendations,
  carrierComparisons,
  realTimeAlerts,
  packagingCostAnalysis,
  carrierCapabilityAnalysis,
  transitImpactPrediction,
  climateAdaptabilityScore,
}) => {
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Climate Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{climateRiskAssessment}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Packaging Recommendations
          </CardTitle>
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
              {packagingRecommendations.map((recommendation, index) => (
                <TableRow key={index}>
                  <TableCell>{recommendation.name}</TableCell>
                  <TableCell>${recommendation.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <ul>
                      {recommendation.specifications.map((spec, i) => (
                        <li key={i}>
                          {spec.name}: {spec.value}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Carrier Comparisons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Capabilities</TableHead>
                <TableHead>Cost Premium</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carrierComparisons.map((carrier, index) => (
                <TableRow key={index}>
                  <TableCell>{carrier.name}</TableCell>
                  <TableCell>{carrier.rating}</TableCell>
                  <TableCell>
                    <ul>
                      {carrier.capabilities.map((capability, i) => (
                        <li key={i}>{capability}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>{carrier.costPremium}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RenderChart
        index={2}
          title="Packaging Cost Analysis"
          chart={packagingCostAnalysis}
        />

        <RenderChart
        index={4}
          title="Carrier Capability Analysis"
          chart={carrierCapabilityAnalysis}
        />

        <RenderChart
          title="Climate Adaptability Score"
          chart={climateAdaptabilityScore}
        />

        <div className="flex flex-col [&>div]:flex-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {realTimeAlerts.map((alert, index) => (
                  <li key={index}>{alert}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transit Impact Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{transitImpactPrediction}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParcelClimateProtectionOutput;
