"use client";
import UrbanParkingFeeMinimizerInputForm from "@/components/urban-parking-fee-minimizer/inputForm";
import UrbanParkingFeeMinimizerOutput from "@/components/urban-parking-fee-minimizer/output";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";

const UrbanParkingFeeMinimizerPage = () => {
  const [data, setData] = useState({
    deliveryLocations: [],
    deliveryTimes: [],
    urgencyLevel: "",
  });
  const [results, setResults] = useState();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchResults = async (inputData) => {
    setLoading(true);
    try {
      setData(inputData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=urban-parking-fee-minimizer`,
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

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Urban Parking Fee Minimizer</h1>
      {!results ? (
        <UrbanParkingFeeMinimizerInputForm
          loading={loading}
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
            Back
          </Button>
          <UrbanParkingFeeMinimizerOutput {...results} />
        </>
      )}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <LoaderCircle className="animate-spin text-white" />
        </div>
      )}
    </div>
  );
};

export default UrbanParkingFeeMinimizerPage;
