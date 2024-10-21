"use client";
import DynamicRoutingToolInputForm from "@/components/dynamic-routing/inputForm";
import DynamicRoutingToolOutput, {
  DynamicRoutingToolOutputProps,
} from "@/components/dynamic-routing/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SAMPLE_DATA: DynamicRoutingToolOutputProps = {
  deliveryTimeComparison: {
    xLabel: "Delivery Time",
    yLabel: "Hours",
    chartType: "barChart",
    data: [
      {
        label: "Original Expected Delivery Time",
        value: 3.0,
      },
      {
        label: "Estimated Delivery Time (Due to Conditions)",
        value: 6.0,
      },
    ],
    explanation:
      "The delivery time has increased from the original expectation of 3 hours due to moderate traffic and severe weather conditions (storm), leading to an additional estimated 3 hours for safe delivery.",
  },
  conditionImpactChart: {
    xLabel: "Conditions",
    yLabel: "Impact on Delivery (Hours)",
    chartType: "barChart",
    data: [
      {
        label: "Traffic Conditions",
        value: 1.0,
      },
      {
        label: "Weather Conditions",
        value: 3.0,
      },
    ],
    explanation:
      "Traffic contributes to a 1 hour delay due to moderate conditions, while the storm significantly impacts delivery, adding 3 hours due to safety concerns and slower driving conditions.",
  },
  priorityBasedRecommendation: {
    xLabel: "Priority Level Impact",
    yLabel: "Impact on Delivery",
    chartType: "pieChart",
    data: [
      {
        label: "High Priority Delivery Steps",
        value: 100.0,
      },
    ],
    explanation:
      "Given the high priority level, implementing priority delivery steps such as advanced scheduling, alternative route searching, and more frequent updates can help mitigate delays.",
  },
  riskLevel: "High",
  riskProgress: 85.0,
  riskExplanation:
    "The risk level is High due to stormy weather conditions which greatly affect travel time, combined with moderate traffic, making delays quite likely.",
  delayImpactAnalysis: [
    {
      label: "Traffic Delay Impact",
      value: 20.0,
    },
    {
      label: "Weather Delay Impact",
      value: 60.0,
    },
  ],
  deliveryStatus: "Delayed",
  deliveryStatusExplanation:
    "The delivery is expected to be delayed primarily due to severe weather conditions. The estimated time now surpasses the original delivery window.",
  trafficSensitivity: {
    level: "Medium",
    explanation:
      "The current route has a medium sensitivity to traffic changes, which means while traffic can increase delays, the primary concern here is the storm affecting delivery.",
  },
  weatherImpactAssessment:
    "The storm significantly increases delivery risks by reducing visibility and road safety, thereby slowing down deliveries.",
  priorityAdjustmentSuggestions:
    "- Maintain high priority level to ensure immediate action on mitigating delays.\n- Consider alternative delivery methods or routes if conditions worsen.\n- Update customers about potential delays for better service.",
};

const DynamicRoutingToolPage = () => {
  const [options, setOptions] = useState<any>({});
  const [data, setData] = useState<any>({
    warehouseRegions: [],
    demandLevels: [],
    leadTime: 0,
    productType: "",
  });
  const [results, setResults] = useState<
    DynamicRoutingToolOutputProps | undefined
  >(SAMPLE_DATA);
  const [loading, setLoading] = useState<string | boolean>("options");
  const router = useRouter();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoading("options");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=dynamic-routing`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }

      const responseData = await response.json();
      setOptions(responseData.options);
    } catch (error) {
      router.replace("/not-found");
    }
    setLoading(false);
  };

  const fetchResults = async (data: any) => {
    setLoading("results");
    try {
      setData(data);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=dynamic-routing`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const responseData = await response.json();
      setResults(responseData.response);
    } catch (error) {
      router.replace("/not-found");
    }
    setLoading(false);
  };

  if (loading === "options") {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <LoaderCircle className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Dynamic Routing</h1>
      {!results ? (
        <DynamicRoutingToolInputForm
          loading={loading === "results"}
          options={options}
          data={data}
          handleSubmit={fetchResults}
        />
      ) : (
        <>
          <Button
            className="ml-0 mr-auto -my-8"
            variant="link"
            onClick={() => setResults(undefined)}
          >
            <ChevronLeft />
            Back
          </Button>
          <DynamicRoutingToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default DynamicRoutingToolPage;
