import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, Package } from "lucide-react";
import RenderChart from "@/components/common/renderChart";

const ParcelFlowOutput = ({
  processingStage,
  bottleneckIndicators,
  delayPrediction,
  riskLevelsByParcelType,
  timePeriod,
  bottleneckImpact,
  recommendations,
  volumeImpactAnalysis,
  seasonalRiskTrends,
  staffUtilization,
  costEfficiency,
}) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle />
              Bottleneck Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {bottleneckIndicators.map((indicator, index) => (
                <li key={index}>{indicator}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock />
              Delay Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Delay Allowance: {delayPrediction.delayAllowance} hours</p>
            <p>
              On-Time Delivery Probability:{" "}
              {delayPrediction.onTimeDeliveryProbability}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RenderChart
          index={2}
          title="Processing Stages"
          chart={processingStage}
        />

        <RenderChart
          title="Risk Levels by Parcel Type"
          chart={riskLevelsByParcelType}
        />

        <RenderChart
          index={1}
          title="Parcel Volume Over Time"
          chart={timePeriod}
        />

        <RenderChart
          index={4}
          title="Bottleneck Impact"
          chart={bottleneckImpact}
        />

        <RenderChart
          index={7}
          title="Volume Impact Analysis"
          chart={volumeImpactAnalysis}
        />

        <RenderChart
          index={1}
          title="Seasonal Risk Trends"
          chart={seasonalRiskTrends}
        />

        <RenderChart title="Staff Utilization" chart={staffUtilization} />

        <div className="flex flex-col [&>div]:flex-1">
          <Card className="mb-6">
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
              <CardTitle>Cost Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{costEfficiency}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParcelFlowOutput;
