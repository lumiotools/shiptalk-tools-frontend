"use client";
import BulkShipmentLabelingOptimizerInputForm from "@/components/bulk-shipment-labeling-optimizer/inputForm";
import BulkShipmentLabelingOptimizerOutput from "@/components/bulk-shipment-labeling-optimizer/output";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import FormContainer from "@/components/common/formContainer";
import ResetButton from "@/components/common/resetButton";

const BulkShipmentLabelingOptimizerPage = () => {
  const [options, setOptions] = useState({});
  const [data, setData] = useState({
    packageType: "",
    carrier: "",
    numberOfLabels: 0,
    shippingType: "",
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=bulk-shipment-labeling-optimizer`
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=bulk-shipment-labeling-optimizer`,
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
        <FormContainer
          title="Bulk Shipment Labeling Optimizer"
          description="Optimize Labeling Strategies for Cost-Effective and Efficient Bulk Shipments"
        >
          <BulkShipmentLabelingOptimizerInputForm
            loading={loading === "results"}
            data={data}
            options={options}
            handleSubmit={fetchResults}
          />
        </FormContainer>
      </div>
    );

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Bulk Shipment Labeling Optimizer</h1>

      <ResetButton resetResults={() => setResults(undefined)} />
      <BulkShipmentLabelingOptimizerOutput {...results} />
    </div>
  );
};

export default BulkShipmentLabelingOptimizerPage;
