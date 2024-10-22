"use client";
import JustInTimeInventoryToolInputForm, {
  JustInTimeInventoryToolOptions,
} from "@/components/just-in-time-inventory/inputForm";
import JustInTimeInventoryToolOutput, {
  JustInTimeInventoryToolOutputProps,
} from "@/components/just-in-time-inventory/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

interface Data {
  average_monthly_demand_units: number;
  current_inventory_level_units: number;
  production_capacity_units_per_month: number;
  warehouse_capacity_units: number;
  main_objectives: string[];
  current_challenges: string[];
}

const JustInTimeInventoryToolPage = () => {
  const [options, setOptions] = useState<object>({});
  const [data, setData] = useState<Data>({
    average_monthly_demand_units: 0,
    current_inventory_level_units: 0,
    production_capacity_units_per_month: 0,
    warehouse_capacity_units: 0,
    main_objectives: [],
    current_challenges: [],
  });
  const [results, setResults] = useState<
    JustInTimeInventoryToolOutputProps | undefined
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

  const fetchResults = async (data: object) => {
    setLoading("results");
    try {
      setData(data as Data);

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

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Just-In-Time Inventory</h1>
      {!results ? (
        <JustInTimeInventoryToolInputForm
          loading={loading === "results"}
          options={options as JustInTimeInventoryToolOptions}
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
          <JustInTimeInventoryToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default JustInTimeInventoryToolPage;
