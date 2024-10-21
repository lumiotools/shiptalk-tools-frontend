"use client";
import CostToServeAnalysisToolInputForm from "@/components/cost-to-serve-analysis/inputForm";
import CostToServeAnalysisToolOutput, {
  CostToServeAnalysisToolOutputProps,
} from "@/components/cost-to-serve-analysis/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CostToServeAnalysisToolPage = () => {
  const [options, setOptions] = useState<any>({});
  const [data, setData] = useState<any>({
    business_model: "",
    key_products: [""],
    customer_segments: [""],
    average_order_values: [],
    supply_chain_costs: {
      Manufacturing: 0,
      Warehousing: 0,
      Distribution: 0,
    },
    user_goals: [],
    challenges: [],
  });
  const [results, setResults] = useState<
    CostToServeAnalysisToolOutputProps | undefined
  >();
  const [loading, setLoading] = useState<string | boolean>("options");
  const router = useRouter();

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
      router.replace("/not-found");
    }
    setLoading(false);
  };

  const fetchResults = async (data: any) => {
    setLoading("results");
    try {
      setData(data);

      data = {
        ...data,
        average_order_values: Object.fromEntries(
          data.average_order_values.map(
            ({
              customer_segment,
              cost,
            }: {
              customer_segment: string;
              cost: number;
            }) => [customer_segment, cost]
          )
        ),
      };

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
      router.replace("/not-found");
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
          <CostToServeAnalysisToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default CostToServeAnalysisToolPage;
