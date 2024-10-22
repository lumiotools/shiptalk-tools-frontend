"use client";
import LastMileDeliverySolutionsToolInputForm, { LastMileDeliverySolutionsToolOptions } from "@/components/last-mile-delivery-solutions/inputForm";
import LastMileDeliverySolutionsToolOutput, {
  LastMileDeliverySolutionsToolOutputProps,
} from "@/components/last-mile-delivery-solutions/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

const LastMileDeliverySolutionsToolPage = () => {
  const [options, setOptions] = useState<object>({});
  interface LastMileDeliveryData {
    daily_orders: number;
    delivery_locations: string[];
    delivery_method: string;
    user_objectives: string[];
    type_of_products: string[];
  }

  const [data, setData] = useState<LastMileDeliveryData>({
    daily_orders: 0,
    delivery_locations: [],
    delivery_method: "",
    user_objectives: [],
    type_of_products: [],
  });
  const [results, setResults] = useState<
    LastMileDeliverySolutionsToolOutputProps | undefined
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=last-mile-delivery-solutions`
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
      setData(data as LastMileDeliveryData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=last-mile-delivery-solutions`,
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
      <h1 className="text-4xl font-bold">Last-Mile Delivery Solutions</h1>
      {!results ? (
        <LastMileDeliverySolutionsToolInputForm
          loading={loading === "results"}
          options={options as LastMileDeliverySolutionsToolOptions}
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
          <LastMileDeliverySolutionsToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default LastMileDeliverySolutionsToolPage;
