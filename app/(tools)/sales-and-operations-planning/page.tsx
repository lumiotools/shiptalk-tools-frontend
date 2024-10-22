"use client";
import SalesAndOperationsPlanningToolInputForm from "@/components/sales-and-operations-planning/inputForm";
import SalesAndOperationsPlanningToolOutput, {
  SalesAndOperationsPlanningToolOutputProps,
} from "@/components/sales-and-operations-planning/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

const SalesAndOperationsPlanningToolPage = () => {
  const [options, setOptions] = useState<any>({});
  const [data, setData] = useState<any>({
    company_size: "",
    industry_sector: "",
    current_sales_data: [
      { month: "", sales: null },
      { month: "", sales: null },
    ],
    inventory_levels: [
      {
        name: "",
        quantity: null,
      },
      {
        name: "",
        quantity: null,
      },
    ],
    operational_constraints: [],
    demand_forecast_horizon_months: null,
    user_objectives: [],
    current_challenges: [],
    seasonal_factors: [{ factor: "" }],
    budget_constraints: null,
  });
  const [results, setResults] = useState<
    SalesAndOperationsPlanningToolOutputProps | undefined
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

  const fetchResults = async (data: any) => {
    setLoading("results");
    try {
      
      setData(data);
      
      data = {
        ...data,
        current_sales_data: Object.fromEntries(
          data.current_sales_data.map(
            ({ month, sales }: { month: string; sales: number }) => [
              month,
              sales,
            ]
          )
        ),
        demand_forecast_horizon_months: data.current_sales_data.length,
        seasonal_factors: data.seasonal_factors.map(
          ({ factor }: { factor: string }) => factor
        ),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=sales-and-operations-planning`,
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
