"use client";
import RenewableTransportCostEstimatorInputForm from "@/components/renewable-transport-cost-estimator/inputForm";
import RenewableTransportCostEstimatorOutput from "@/components/renewable-transport-cost-estimator/output";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import FormContainer from "@/components/common/formContainer";
import ResetButton from "@/components/common/resetButton";

const RenewableTransportCostEstimatorPage = () => {
  const [options, setOptions] = useState({});
  const [data, setData] = useState({
    routeDistance: 0,
    vehicleType: "",
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=renewable-transport-cost-estimator`
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

  const fetchResults = async (inputData) => {
    setLoading("results");
    try {
      setData(inputData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=renewable-transport-cost-estimator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputData),
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
      <div className="w-full min-h-screen flex flex-col justify-center items-center gap-8 p-8">
        <FormContainer className="max-w-screen-sm" title="Renewable Transport Cost Estimator" description="Calculate Costs for Eco-Friendly Shipping with Renewable-Powered Carriers">
          <RenewableTransportCostEstimatorInputForm
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
      <h1 className="text-4xl font-bold">Renewable Transport Cost Estimator</h1>
      <ResetButton resetResults={() => setResults(undefined)} />
      <RenewableTransportCostEstimatorOutput {...results} />
    </div>
  );
};

export default RenewableTransportCostEstimatorPage;
