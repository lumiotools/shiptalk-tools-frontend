import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import MarkdownRenderer from "../ui/markdown";
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

export interface FreightConsolidationToolOutputProps {
  consolidationRate: number;
  consolidationDetails: Plot;
  totalShippingCostBefore: number;
  totalShippingCostAfter: number;
  costSavings: number;
  discountApplied: number;
  carrierUsage: ComparisonPlot;
  carrierLoadDistribution: Plot;
  costComparison: Plot;
  deliveryDelayRisk: string;
  priorityRecommendations: string;
  priorityImpact: string;
  shipmentRecommendations: string;
  costEfficiencyExplanation: string;
  carrierRecommendations: string;
}

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
}: FreightConsolidationToolOutputProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageCheck className="h-5 w-5" />
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
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
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
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
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
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delivery Delay Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{deliveryDelayRisk}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Priority Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{priorityRecommendations}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Priority Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{priorityImpact}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5" />
              Shipment Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{shipmentRecommendations}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Cost Efficiency Explanation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{costEfficiencyExplanation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
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
