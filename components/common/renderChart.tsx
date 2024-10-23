import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

export interface Plot {
  xLabel: string;
  yLabel: string;
  chartType: string;
  data: {
    label: string;
    value: number;
  }[];
  explanation: string;
}

export interface ComparisonPlot {
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

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const RenderChart: React.FC<{
  index?: number;
  chart?: Plot;
  comparisonChart?: ComparisonPlot;
  title?: string;
}> = ({ index = 0, title, chart, comparisonChart }) => {
  const renderChart = () => {
    if (comparisonChart) {
      return (
        <ResponsiveContainer width="100%" height={300}>
          {comparisonChart.actualData &&
          comparisonChart.actualData.length > 0 ? (
            <BarChart
              data={comparisonChart.actualData.map(
                ({ label, value }, index) => ({
                  label,
                  actualValue: value,
                  comparedValue: comparisonChart.comparedData[index]?.value,
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
                        <p>{`${payload[0]?.name}: ${payload[0]?.value}`}</p>
                        <p>{`${payload[1]?.name}: ${payload[1]?.value}`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar
                dataKey="actualValue"
                name={comparisonChart.yActualLabel}
                fill="#8884d8"
              />
              <Bar
                dataKey="comparedValue"
                name={comparisonChart.yComparedLabel}
                fill="#82ca9d"
              />
            </BarChart>
          ) : (
            <div className="flex items-center justify-center h-full">
              No data available
            </div>
          )}
        </ResponsiveContainer>
      );
    }

    if (!chart) return <></>;
    switch (chart.chartType) {
      case "barChart":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="value"
                name={chart.yLabel}
                fill={COLORS[index % COLORS.length]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case "pieChart":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey={"label"}
                label={({ label, percent }) =>
                  `${label} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chart.data.map((entry, index) => (
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
                        <p className="font-semibold">{chart.yLabel}</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2.5 rounded-[2px]"
                            style={{ backgroundColor: payload[0].payload.fill }}
                          />
                          <p className="flex-1">
                            <span className="text-muted-foreground">
                              {payload[0].name}:
                            </span>
                            {payload[0].value}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return <>{chart.chartType}</>;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "lineChart":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.data} >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={chart.yLabel}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "scatterPlot":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="label" name={" "} />
              <YAxis
                type="number"
                dataKey="value"
                name="Potential Savings"
                unit="$"
              />

              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Scatter
                name="Risk vs. Savings"
                data={chart.data}
                fill={COLORS[index % COLORS.length]}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case "radarChart":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chart.data} >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="value" label={"hi"} />
              <PolarGrid />
              <Radar
                name={chart.yLabel}
                dataKey="value"
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.6}
              />
              <Tooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const Chart = renderChart();

  if (!Chart) return <></>;

  const { explanation } = chart || comparisonChart || {};

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title ?? explanation}</CardTitle>
        {title && <CardDescription>{explanation}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px]">
          {Chart}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RenderChart;
