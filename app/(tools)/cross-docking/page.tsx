"use client";
import CrossDockingToolInputForm, {
  CrossDockingToolOptions,
} from "@/components/cross-docking/inputForm";
import CrossDockingToolOutput, {
  CrossDockingToolOutputProps,
} from "@/components/cross-docking/output";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CrossDockingData {
  incomingTrucks: {
    arrivalTime: string;
    loadType: string;
    quantity: number;
  }[];
  outboundTrucks: {
    departureTime: string;
    capacity: number;
  }[];
  docksAvailable: number;
  laborAvailable: number;
  priorityLevel: string;
  trafficConditions: string;
  weatherConditions: string;
}

const CrossDockingToolPage = () => {
  const [options, setOptions] = useState<object>({});
  const [data, setData] = useState<CrossDockingData>({
    incomingTrucks: [
      {
        arrivalTime: "",
        loadType: "",
        quantity: 0,
      },
      {
        arrivalTime: "",
        loadType: "",
        quantity: 0,
      },
    ],
    outboundTrucks: [
      {
        departureTime: "",
        capacity: 0,
      },
    ],
    docksAvailable: 0,
    laborAvailable: 0,
    priorityLevel: "",
    trafficConditions: "",
    weatherConditions: "",
  });
  const [results, setResults] = useState<
    CrossDockingToolOutputProps | undefined
  >();
  const [loading, setLoading] = useState<string | boolean>("options");
  const { toast } = useToast();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoading("options");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=cross-docking`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }

      const responseData = await response.json();
      setOptions(responseData.options);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Request Failed",
      });
    }
    setLoading(false);
  };

  const fetchResults = async (data: object) => {
    setLoading("results");
    try {
      setData(data as CrossDockingData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=cross-docking`,
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
      toast({
        variant: "destructive",
        description: "Request Failed",
      });
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
      <h1 className="text-4xl font-bold">Cross Docking</h1>
      {!results ? (
        <CrossDockingToolInputForm
          loading={loading === "results"}
          options={options as CrossDockingToolOptions}
          data={data as CrossDockingData}
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
          <CrossDockingToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default CrossDockingToolPage;
