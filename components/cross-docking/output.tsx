import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import RenderChart, { ComparisonPlot, Plot } from "../common/renderChart";
import { AlertTriangle, Clock, TrendingUp, Truck } from "lucide-react";
import { Progress } from "../ui/progress";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

export interface CrossDockingToolOutputProps {
  carrierOptimization: Plot;
  dockScheduling: string;
  laborAllocation: Plot;
  riskAssessment: {
    riskLevel: string;
    riskProgress: number;
    explanation: string;
  };
  deliveryTimelineComparison: ComparisonPlot;

  deliveryStatus: {
    status: string;
    explanation: string;
  };
  costEfficiency: {
    laborEfficiency: string;
    dockUtilization: string;
    truckCapacityUtilization: string;
  };
}

const CrossDockingToolOutput = ({
  carrierOptimization,
  dockScheduling,
  laborAllocation,
  riskAssessment,
  deliveryTimelineComparison,
  deliveryStatus,
  costEfficiency,
}: CrossDockingToolOutputProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RenderChart
          chart={carrierOptimization}
          title="Carrier Optimization"
          index={3}
        />
        <RenderChart chart={laborAllocation} title="Labor Allocation" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Dock Scheduling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{dockScheduling}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-2">
            <span className="font-semibold">Risk Level:</span>
            <span
              className={`font-bold ${
                riskAssessment.riskLevel === "High"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {riskAssessment.riskLevel}
            </span>
          </div>
          <Progress value={riskAssessment.riskProgress} className="mb-2" />
          <p>{riskAssessment.explanation}</p>
        </CardContent>
      </Card>

      <RenderChart
        comparisonChart={deliveryTimelineComparison}
        title="Delivery Timeline Comparison"
      />

      <Card className="my-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Delivery Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-2">
            <span className="font-semibold">Status:</span>
            <span
              className={`font-bold ${
                deliveryStatus.status === "On Time"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {deliveryStatus.status}
            </span>
          </div>
          <p>{deliveryStatus.explanation}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Cost Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Labor Efficiency</TableCell>
                <TableCell>{costEfficiency.laborEfficiency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dock Utilization</TableCell>
                <TableCell>{costEfficiency.dockUtilization}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Truck Capacity Utilization
                </TableCell>
                <TableCell>{costEfficiency.truckCapacityUtilization}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrossDockingToolOutput;
