"use client";
import CostToServeAnalysisToolInputForm, {
  CostToServeAnalysisToolOptions,
} from "@/components/cost-to-serve-analysis/inputForm";
import CostToServeAnalysisToolOutput, {
  CostToServeAnalysisToolOutputProps,
} from "@/components/cost-to-serve-analysis/output";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

const CostToServeAnalysisToolPage = () => {
  const [options, setOptions] = useState<object>({});
  interface CostToServeAnalysisData {
    business_model: string;
    customer_segments: string[];
    total_supply_chain_cost: number;
    average_order_value: number;
    user_goals: string[];
    challenges: string[];
    industry_type: string;
    geographical_scope: string;
  }

  const [data, setData] = useState<CostToServeAnalysisData>({
    business_model: "",
    customer_segments: [],
    total_supply_chain_cost: 0,
    average_order_value: 0,
    user_goals: [],
    challenges: [],
    industry_type: "",
    geographical_scope: "",
  });
  const [results, setResults] = useState<
    CostToServeAnalysisToolOutputProps | undefined
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=cost-to-serve-analysis`
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
      setData(data as CostToServeAnalysisData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=cost-to-serve-analysis`,
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
      <h1 className="text-4xl font-bold">Cost to Serve Analysis</h1>
      {!results ? (
        <CostToServeAnalysisToolInputForm
          loading={loading === "results"}
          options={options as CostToServeAnalysisToolOptions}
          data={data as CostToServeAnalysisData}
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
          <CostToServeAnalysisToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default CostToServeAnalysisToolPage;
