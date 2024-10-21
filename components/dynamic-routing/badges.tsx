import { AlertTriangle, Clock, TrafficCone } from "lucide-react";
import { Badge } from "../ui/badge";

export const StatusBadge = ({ status }: { status: string }) => {
  const color = status === "Delayed" ? "destructive" : "default";
  return (
    <Badge variant={color} className="ml-2">
      <Clock className="mr-1 h-3 w-3" />
      {status}
    </Badge>
  );
};

export const RiskBadge = ({ level }: { level: string }) => {
  const color =
    level === "High"
      ? "destructive"
      : level === "Medium"
      ? "secondary"
      : "default";
  return (
    <Badge variant={color} className="ml-2">
      <AlertTriangle className="mr-1 h-3 w-3" />
      {level}
    </Badge>
  );
};

export const TrafficSensitivityBadge = ({ level }: { level: string }) => {
  const color =
    level === "High"
      ? "destructive"
      : level === "Medium"
      ? "secondary"
      : "default";
  return (
    <Badge variant={color} className="ml-2">
      <TrafficCone className="mr-1 h-3 w-3" />
      {level}
    </Badge>
  );
};
