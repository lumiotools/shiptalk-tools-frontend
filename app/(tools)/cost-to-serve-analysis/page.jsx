"use client";
import FormContainer from "@/components/common/formContainer";
import ResetButton from "@/components/common/resetButton";
import CostToServeAnalysisToolInputForm from "@/components/cost-to-serve-analysis/inputForm";
import CostToServeAnalysisToolOutput from "@/components/cost-to-serve-analysis/output";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

const CostToServeAnalysisToolPage = () => {
  const [options, setOptions] = useState({});
  const [data, setData] = useState({
    business_model: "",
    customer_segments: [],
    total_supply_chain_cost: 0,
    average_order_value: 0,
    user_goals: [],
    challenges: [],
    industry_type: "",
    geographical_scope: "",
  });
  const [results, setResults] = useState();
  const [loading, setLoading] = useState("options");
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

  const fetchResults = async (data) => {
    setLoading("results");
    try {
      setData(data);

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

  if (!results)
    return (
      <div className="w-full min-h-screen flex flex-col items-center gap-8 p-8">
        <FormContainer
          title="Cost to Serve Analysis"
          description="Assess Service Costs Across the Supply Chain to Enhance Profitability and Operational Efficiency"
        >
          <CostToServeAnalysisToolInputForm
            loading={loading === "results"}
            options={options}
            data={data}
            handleSubmit={fetchResults}
          />
        </FormContainer>
      </div>
    );

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Cost to Serve Analysis</h1>
      <ResetButton resetResults={() => setResults(undefined)} />
      <CostToServeAnalysisToolOutput {...results} />
    </div>
  );
};

export default CostToServeAnalysisToolPage;
