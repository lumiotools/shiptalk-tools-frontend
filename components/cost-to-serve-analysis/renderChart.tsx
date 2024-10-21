// Removed incorrect import from "lucide-react"
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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CostToServeAnalysisToolPlot {
  xLabel: string;
  yLabel: string;
  chartType: string;
  data: {
    label: string;
    value: number;
  }[];
  explanation: string;
}

export const CostToServeAnalysisRenderChart = (
  visualization: CostToServeAnalysisToolPlot
) => {
  const COLORS = [
    "#8884d8",
    "#00C49F",
    "#0088FE",
    "#FF8042",
    "#00C49F",
    "#FFBB28",
  ];

  switch (visualization.chartType) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={visualization.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      );
    case "pie":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={visualization.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {visualization.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    case "line":
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={visualization.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      );
    default:
      return null;
  }
};
