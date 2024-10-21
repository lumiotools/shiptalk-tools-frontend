import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer } from "../ui/chart";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Progress } from "../ui/progress";
import MarkdownRenderer from "../ui/markdown";

interface DistributedInventoryToolPlot {
  xLabel: string;
  yLabel: string;
  chartType: string;
  data: {
    label: string;
    value: number;
  }[];
  explanation: string;
}

interface DistributedInventoryToolComparisonPlot {
  xLabel: string;
  yLabel: string;
  yActualLabel: string;
  yComparedLabel: string;
  chartType: string;
  actualData: {
    label: string;
    value: number;
  }[];
  comparedData: {
    label: string;
    value: number;
  }[];
  explanation: string;
}

interface DistributedInventoryToolRiskAssessment {
  riskLevel: string;
  riskProgress: number;
  explanation: string;
}

interface DistributedInventoryToolReplinishmentUrgency {
  urgencyLevel: string;
  replenishmentProgress: number;
  explanation: string;
}

interface DistributedInventoryToolDemandVolatility {
  volatilityPercentage: number;
  explanation: string;
}

interface DistributedInventoryToolEfficiency {
  efficiencyPercentage: number;
  explanation: string;
}

export interface DistributedInventoryToolOutputProps {
  inventoryDistribution: DistributedInventoryToolPlot;
  replenishmentSchedule: DistributedInventoryToolPlot;
  shippingCostsAndTimes: DistributedInventoryToolComparisonPlot;
  warehouseUtilization: DistributedInventoryToolPlot;
  demandForecast: DistributedInventoryToolPlot;
  costToServe: DistributedInventoryToolPlot;
  newWarehouseRecommendation: DistributedInventoryToolPlot;
  inventoryRiskAssessment: DistributedInventoryToolRiskAssessment;
  replenishmentUrgency: DistributedInventoryToolReplinishmentUrgency;
  demandVolatility: DistributedInventoryToolDemandVolatility;
  costEfficiency: DistributedInventoryToolEfficiency;
  warehouseEfficiency: DistributedInventoryToolEfficiency;
  conclusion: string;
}

const DistributedInventoryToolOutput = ({
  inventoryDistribution,
  replenishmentSchedule,
  shippingCostsAndTimes,
  demandForecast,
  costToServe,
  newWarehouseRecommendation,
  inventoryRiskAssessment,
  replenishmentUrgency,
  demandVolatility,
  costEfficiency,
  warehouseEfficiency,
  conclusion,
}: DistributedInventoryToolOutputProps) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Distribution</CardTitle>
            <CardDescription>
              <MarkdownRenderer
                markdownText={inventoryDistribution.explanation}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                {inventoryDistribution.data &&
                inventoryDistribution.data.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={inventoryDistribution.data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      name={inventoryDistribution.yLabel}
                      label={({ label, percent }) =>
                        `${label} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {inventoryDistribution.data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-background p-2 rounded shadow">
                              <p className="font-semibold">{label}</p>
                              <p>{`${payload[0].name}: ${payload[0].value}%`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Replenishment Schedule</CardTitle>
            <CardDescription>
              <MarkdownRenderer
                markdownText={replenishmentSchedule.explanation}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                {replenishmentSchedule.data &&
                replenishmentSchedule.data.length > 0 ? (
                  <BarChart data={replenishmentSchedule.data}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-background p-2 rounded shadow">
                              <p className="font-semibold">{label}</p>
                              <p>{`${payload[0].name}: ${payload[0].value}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#8884d8"
                      name={replenishmentSchedule.yLabel}
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Costs and Times</CardTitle>
            <CardDescription>
              <MarkdownRenderer
                markdownText={shippingCostsAndTimes.explanation}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                {shippingCostsAndTimes.actualData &&
                shippingCostsAndTimes.actualData.length > 0 ? (
                  <BarChart
                    data={shippingCostsAndTimes.actualData.map(
                      ({ label, value }, index) => ({
                        label,
                        actualValue: value,
                        comparedValue:
                          shippingCostsAndTimes.comparedData[index].value,
                      })
                    )}
                  >
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-background p-2 rounded shadow">
                              <p className="font-semibold">{label}</p>
                              <p>{`${payload[0].name}: ${payload[0].value}`}</p>
                              <p>{`${payload[1].name}: ${payload[1].value}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="actualValue"
                      name={shippingCostsAndTimes.yActualLabel}
                      fill="#8884d8"
                    />
                    <Bar
                      dataKey="comparedValue"
                      name={shippingCostsAndTimes.yComparedLabel}
                      fill="#82ca9d"
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demand Forecast</CardTitle>
            <CardDescription>
              <MarkdownRenderer markdownText={demandForecast.explanation} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                {demandForecast.data && demandForecast.data.length > 0 ? (
                  <LineChart data={demandForecast.data}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-background p-2 rounded shadow">
                              <p className="font-semibold">{label}</p>
                              <p>{`${payload[0].name}: ${payload[0].value}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      name={demandForecast.yLabel}
                    />
                  </LineChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost to Serve</CardTitle>
            <CardDescription>
              <MarkdownRenderer markdownText={costToServe.explanation} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                {costToServe.data && costToServe.data.length > 0 ? (
                  <BarChart data={costToServe.data}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-background p-2 rounded shadow">
                              <p className="font-semibold">{label}</p>
                              <p>{`${payload[0].name}: ${payload[0].value}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#8884d8"
                      name={costToServe.yLabel}
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Warehouse Recommendation</CardTitle>
            <CardDescription>
              <MarkdownRenderer
                markdownText={newWarehouseRecommendation.explanation}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px]" config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                {newWarehouseRecommendation.data &&
                newWarehouseRecommendation.data.length > 0 ? (
                  <BarChart data={newWarehouseRecommendation.data}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      content={({ payload, label }) => {
                        if (payload && payload.length) {
                          return (
                            <div className="bg-background p-2 rounded shadow">
                              <p className="font-semibold">{label}</p>
                              <p>{`${payload[0].name}: ${payload[0].value}`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#8884d8"
                      name={newWarehouseRecommendation.yLabel}
                    />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    No data available
                  </div>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Risk Assessment</CardTitle>
            <CardDescription>
              <MarkdownRenderer
                markdownText={inventoryRiskAssessment.explanation}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Risk Level: {inventoryRiskAssessment.riskLevel}</span>
                <span>{inventoryRiskAssessment.riskProgress}%</span>
              </div>
              <Progress
                value={inventoryRiskAssessment?.riskProgress ?? 0}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Replenishment Urgency</CardTitle>
            <CardDescription>
              <MarkdownRenderer
                markdownText={replenishmentUrgency.explanation}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Urgency Level: {replenishmentUrgency.urgencyLevel}</span>
                <span>{replenishmentUrgency.replenishmentProgress}%</span>
              </div>
              <Progress
                value={replenishmentUrgency?.replenishmentProgress ?? 0}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demand Volatility</CardTitle>
            <CardDescription>
              <MarkdownRenderer markdownText={demandVolatility.explanation} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Volatility</span>
                <span>{demandVolatility.volatilityPercentage}%</span>
              </div>
              <Progress
                value={demandVolatility?.volatilityPercentage ?? 0}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Efficiency</CardTitle>
            <CardDescription>
              <MarkdownRenderer markdownText={costEfficiency.explanation} />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Efficiency</span>
                <span>{costEfficiency.efficiencyPercentage}%</span>
              </div>
              <Progress
                value={costEfficiency?.efficiencyPercentage ?? 0}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warehouse Efficiency</CardTitle>
            <CardDescription>
              <MarkdownRenderer
                markdownText={warehouseEfficiency.explanation}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Efficiency</span>
                <span>{warehouseEfficiency.efficiencyPercentage}%</span>
              </div>
              <Progress
                value={warehouseEfficiency?.efficiencyPercentage ?? 0}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conclusion</CardTitle>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer
            markdownText={conclusion.replace("Conclusion", "")}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributedInventoryToolOutput;
