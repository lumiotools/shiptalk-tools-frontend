"use client";
import CycleCountingToolInputForm, {
  CycleCountingToolOptions,
} from "@/components/cycle-counting/inputForm";
import CycleCountingToolOutput, {
  CycleCountingToolOutputProps,
} from "@/components/cycle-counting/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

const CycleCountingToolPage = () => {
  const [options, setOptions] = useState<object>({});
  interface CycleCountingData {
    cycleCountFrequency: string;
    expectedCount: number;
    currentInventoryLevels: number;
    priorityLevel: string;
    warehouseRegions: string[];
    demandLevels: string[];
    leadTime: number;
    productType: string;
  }

  const [data, setData] = useState<CycleCountingData>({
    cycleCountFrequency: "",
    expectedCount: 0,
    currentInventoryLevels: 0,
    priorityLevel: "",
    warehouseRegions: [],
    demandLevels: [],
    leadTime: 0,
    productType: "",
  });
  const [results, setResults] = useState<
    CycleCountingToolOutputProps | undefined
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=cycle-counting`
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
      setData(data as CycleCountingData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=cycle-counting`,
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
      <h1 className="text-4xl font-bold">Cycle Counting</h1>
      {!results ? (
        <CycleCountingToolInputForm
          loading={loading === "results"}
          options={options as CycleCountingToolOptions}
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
          <CycleCountingToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default CycleCountingToolPage;
