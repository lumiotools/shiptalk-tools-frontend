import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import RenderChart, { ComparisonPlot, Plot } from "../common/renderChart";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  PackageCheck,
  Percent,
  Ship,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const FreightConsolidationToolOutput = ({
  consolidationRate,
  consolidationDetails,
  totalShippingCostBefore,
  totalShippingCostAfter,
  costSavings,
  discountApplied,
  carrierUsage,
  carrierLoadDistribution,
  costComparison,
  deliveryDelayRisk,
  priorityRecommendations,
  priorityImpact,
  shipmentRecommendations,
  costEfficiencyExplanation,
  carrierRecommendations,
}) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PackageCheck />
              Consolidation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">
              {consolidationRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign />
              Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              ${costSavings.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Percent />
              Discount Applied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">
              {discountApplied}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RenderChart
          title="Cost Distribution"
          chart={consolidationDetails}
          index={2}
        />
        <RenderChart title="Carrier Usage" comparisonChart={carrierUsage} />
        <RenderChart
          title="Carrier Load Distribution"
          chart={carrierLoadDistribution}
          index={3}
        />
        <RenderChart title="Cost Comparison" chart={costComparison} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle />
              Delivery Delay Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{deliveryDelayRisk}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star />
              Priority Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{priorityRecommendations}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock />
              Priority Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{priorityImpact}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ship />
              Shipment Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{shipmentRecommendations}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp />
              Cost Efficiency Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{costEfficiencyExplanation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users />
              Carrier Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{carrierRecommendations}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreightConsolidationToolOutput;
