"use client";
import FreightConsolidationToolInputForm, {
  FreightConsolidationToolOptions,
} from "@/components/freight-consolidation/inputForm";
import FreightConsolidationToolOutput, {
  FreightConsolidationToolOutputProps,
} from "@/components/freight-consolidation/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

const FreightConsolidationToolPage = () => {
  const [options, setOptions] = useState<object>({});
  interface FreightConsolidationData {
    orders: {
      orderWeight: number;
      destinationAddress: string;
      originAddress: string;
      serviceType: string;
    }[];
    carrierOptions: { carrierName: string; carrierCapacity: number }[];
    maxDeliveryTime: number;
    consolidationThreshold: number;
    shippingCostPerUnit: number;
    bulkDiscountRate: number;
    priorityLevel: string;
  }

  const [data, setData] = useState<FreightConsolidationData>({
    orders: [],
    carrierOptions: [],
    maxDeliveryTime: 0,
    consolidationThreshold: 0,
    shippingCostPerUnit: 0,
    bulkDiscountRate: 0,
    priorityLevel: "",
  });
  const [results, setResults] = useState<
    FreightConsolidationToolOutputProps | undefined
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=freight-consolidation`
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
      setData(data as FreightConsolidationData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=freight-consolidation`,
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
      <h1 className="text-4xl font-bold">Freight Consolidation</h1>
      {!results ? (
        <FreightConsolidationToolInputForm
          loading={loading === "results"}
          options={options as FreightConsolidationToolOptions}
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
          <FreightConsolidationToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default FreightConsolidationToolPage;