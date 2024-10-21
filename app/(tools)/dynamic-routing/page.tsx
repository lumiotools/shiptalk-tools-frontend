"use client";
import DynamicRoutingToolInputForm from "@/components/dynamic-routing/inputForm";
import DynamicRoutingToolOutput, {
  DynamicRoutingToolOutputProps,
} from "@/components/dynamic-routing/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DynamicRoutingToolPage = () => {
  const [options, setOptions] = useState<any>({});
  const [data, setData] = useState<any>({
    warehouseRegions: [],
    demandLevels: [],
    leadTime: 0,
    productType: "",
  });
  const [results, setResults] = useState<
    DynamicRoutingToolOutputProps | undefined
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=dynamic-routing`
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

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=dynamic-routing`,
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
      <h1 className="text-4xl font-bold">Dynamic Routing</h1>
      {!results ? (
        <DynamicRoutingToolInputForm
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
          <DynamicRoutingToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default DynamicRoutingToolPage;
