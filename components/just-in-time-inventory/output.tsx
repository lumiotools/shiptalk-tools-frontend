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
  Boxes,
  DollarSign,
  List,
  TrendingUp,
} from "lucide-react";
import { Progress } from "../ui/progress";

export interface JustInTimeInventoryToolOutputProps {
  inventoryLevelVsDemand: Plot;
  productionCapacityUtilization: Plot;
  warehouseCapacityVsInventory: ComparisonPlot;
  objectiveFulfillmentAnalysis: Plot;
  costToServeAnalysis: Plot;
  riskAssessment: {
    riskLevel: string;
    progress: number;
    explanation: string;
  };
  costSavingsPotential: {
    percentage: number;
    explanation: string;
  };
  keyPerformanceIndicators: string[];
  implementationPlan: string;
  conclusion: string;
}

const JustInTimeInventoryToolOutput = ({
  inventoryLevelVsDemand,
  productionCapacityUtilization,
  warehouseCapacityVsInventory,
  objectiveFulfillmentAnalysis,
  costToServeAnalysis,
  riskAssessment,
  costSavingsPotential,
  keyPerformanceIndicators,
  implementationPlan,
  conclusion,
}: JustInTimeInventoryToolOutputProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RenderChart
          title="Inventory Level vs. Demand"
          chart={inventoryLevelVsDemand}
          index={1}
        />
        <RenderChart
          title="Production Capacity Utilization"
          chart={productionCapacityUtilization}
        />
        <RenderChart
          title="Warehouse Capacity vs. Inventory"
          comparisonChart={warehouseCapacityVsInventory}
        />
        <RenderChart
          title="Objective Fulfillment Analysis"
          chart={objectiveFulfillmentAnalysis}
          index={2}
        />
        <RenderChart
          title="Cost to Serve Analysis"
          chart={costToServeAnalysis}
          index={3}
        />

        <div className="flex flex-col gap-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">Risk Level: {riskAssessment.riskLevel}</p>
              <Progress value={riskAssessment.progress} className="mb-2" />
              <p>{riskAssessment.explanation}</p>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost Savings Potential
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600 mb-2">
                {costSavingsPotential.percentage}%
              </p>
              <p>{costSavingsPotential.explanation}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5" />
              Implementation Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer markdownText={implementationPlan} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              {keyPerformanceIndicators.map((kpi, index) => (
                <li key={index}>{kpi}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Conclusion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer markdownText={conclusion} />
        </CardContent>
      </Card>
    </div>
  );
};

export default JustInTimeInventoryToolOutput;
