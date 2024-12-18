"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import ParcelClimateProtectionInputForm from "@/components/parcel-climate-protection/inputForm";
import ParcelClimateProtectionOutput from "@/components/parcel-climate-protection/output";
import FormContainer from "@/components/common/formContainer";
import ResetButton from "@/components/common/resetButton";

const ParcelClimateProtectionPage = () => {
  const [options, setOptions] = useState({
    sensitivityLevel: [],
    climateCondition: [],
    urgencyLevel: [],
  });

  const [data, setData] = useState({
    productType: "",
    climateCondition: "",
    sensitivityLevel: "",
    carrierOptions: [],
    urgencyLevel: "",
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=parcel-climate-protection`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch options");
      }

      const responseData = await response.json();
      setOptions(responseData.options);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to fetch options",
      });
    }
    setLoading(false);
  };

  const fetchResults = async (formData) => {
    setLoading("results");
    try {
      setData(formData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=parcel-climate-protection`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
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
          title="Parcel Climate Protection Assessment"
          description="Ensure Safe Transit for Sensitive Parcels with Climate Risk Analysis and Recommendations"
        >
          <ParcelClimateProtectionInputForm
            loading={loading === "results"}
            options={options}
            data={data}
            handleSubmit={fetchResults}
          />
        </FormContainer>
      </div>
    );

  return (
    <div className="w-full min-h-screen flex flex-col justify-center  items-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Parcel Climate Protection</h1>

      <ResetButton resetResults={() => setResults(undefined)} />
      <ParcelClimateProtectionOutput {...results} />
    </div>
  );
};

export default ParcelClimateProtectionPage;
