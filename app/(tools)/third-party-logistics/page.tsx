"use client";
import ThirdPartyLogisticsToolInputForm, {
  ThirdPartyLogisticsToolOptions,
} from "@/components/third-party-logistics/inputForm";
import ThirdPartyLogisticsToolOutput, {
  ThirdPartyLogisticsToolOutputProps,
} from "@/components/third-party-logistics/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

const ThirdPartyLogisticsToolPage = () => {
  const [options, setOptions] = useState<object>({});
  interface ThirdPartyLogisticsData {
    compunknown_size: string;
    logistics_functions_to_outsource: string[];
    geographic_regions: string[];
    types_of_products: string[];
    shipment_volume_per_month: number;
    user_objectives: string[];
    constraints: string[];
    current_challenges: string[];
  }

  const [data, setData] = useState<ThirdPartyLogisticsData>({
    compunknown_size: "",
    logistics_functions_to_outsource: [],
    geographic_regions: [],
    types_of_products: [],
    shipment_volume_per_month: 0,
    user_objectives: [],
    constraints: [],
    current_challenges: [],
  });
  const [results, setResults] = useState<
    ThirdPartyLogisticsToolOutputProps | undefined
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=third-party-logistics`
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
      setData(data as ThirdPartyLogisticsData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=third-party-logistics`,
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
      <h1 className="text-4xl font-bold">Third-Party Logistics (3PL)</h1>
      {!results ? (
        <ThirdPartyLogisticsToolInputForm
          loading={loading === "results"}
          options={options as ThirdPartyLogisticsToolOptions}
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
          <ThirdPartyLogisticsToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default ThirdPartyLogisticsToolPage;
