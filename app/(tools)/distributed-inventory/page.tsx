"use client";
import DistributedInventoryToolInputForm from "@/components/distributed-inventory/inputForm";
import DistributedInventoryToolOutput, {
  DistributedInventoryToolOutputProps,
} from "@/components/distributed-inventory/output";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DistributedInventoryToolPage = () => {
  const [options, setOptions] = useState<any>({});
  const [data, setData] = useState<any>({
    warehouseRegions: [],
    demandLevels: [],
    leadTime: 0,
    productType: "",
  });
  const [results, setResults] = useState<
    DistributedInventoryToolOutputProps | undefined
  >();
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=distributed-inventory`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }

      const responseData = await response.json();
      setOptions({
        ...responseData.options,
        regions: ["North America", "Europe", "Asia", "Africa", "South America"],
        productTypes: [
          "Luxury Goods",
          "Consumer Goods",
          "Electronics",
          "Food",
          "Clothing",
          "Furniture",
          "Automotive",
          "Medical Supplies",
        ],
      });
    } catch (error) {
      router.replace("/not-found");
    }
    setLoading(false);
  };

  const fetchResults = async (data: any) => {
    setLoading(true);
    try {
      setData(data);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=distributed-inventory`,
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

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <LoaderCircle className="size-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Distributed Inventory </h1>
      {!results ? (
        <DistributedInventoryToolInputForm
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
          <DistributedInventoryToolOutput {...results} />
        </>
      )}
    </div>
  );
};

export default DistributedInventoryToolPage;
