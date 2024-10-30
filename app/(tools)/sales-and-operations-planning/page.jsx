"use client";
import SalesAndOperationsPlanningToolInputForm from "@/components/sales-and-operations-planning/inputForm";
import SalesAndOperationsPlanningToolOutput from "@/components/sales-and-operations-planning/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

const SalesAndOperationsPlanningToolPage = () => {
  const [options, setOptions] = useState({});

  const [data, setData] = useState({});
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=sales-and-operations-planning`
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

      const updatedData = {
        ...data,
        current_sales_data: Object.fromEntries(
          data.current_sales_data.map(({ month, sales }) => [month, sales])
        ),
        demand_forecast_horizon_months: data.current_sales_data.length,
        seasonal_factors: data.seasonal_factors.map(({ factor }) => factor),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=sales-and-operations-planning`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
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
      <h1 className="text-4xl font-bold">
        Sales and Operations Planning (S&OP)
      </h1>
      {!results ? (
        <SalesAndOperationsPlanningToolInputForm
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
          <SalesAndOperationsPlanningToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default SalesAndOperationsPlanningToolPage;
