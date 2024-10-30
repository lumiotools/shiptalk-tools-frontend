"use client";
import JustInTimeInventoryToolInputForm from "@/components/just-in-time-inventory/inputForm";
import JustInTimeInventoryToolOutput from "@/components/just-in-time-inventory/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import FormContainer from "@/components/common/formContainer";
import ResetButton from "@/components/common/resetButton";

const JustInTimeInventoryToolPage = () => {
  const [options, setOptions] = useState({});
  const [data, setData] = useState({
    average_monthly_demand_units: 0,
    current_inventory_level_units: 0,
    production_capacity_units_per_month: 0,
    warehouse_capacity_units: 0,
    main_objectives: [],
    current_challenges: [],
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=just-in-time-inventory`
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=just-in-time-inventory`,
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
      <div className="w-full min-h-screen flex flex-col justify-center items-center gap-8 p-8">
        <FormContainer
          title="Just-In-Time Inventory"
          description="Optimize Inventory Levels by Matching Production and Demand for Efficiency"
        >
          <JustInTimeInventoryToolInputForm
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
      <h1 className="text-4xl font-bold">Just-In-Time Inventory</h1>
      <ResetButton resetResults={() => setResults(undefined)} />
      <JustInTimeInventoryToolOutput {...results} />
    </div>
  );
};

export default JustInTimeInventoryToolPage;
