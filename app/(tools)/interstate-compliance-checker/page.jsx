"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import InterstateComplianceCheckerInputForm from "@/components/interstate-compliance-checker/inputForm";
import InterstateComplianceCheckerOutput from "@/components/interstate-compliance-checker/output";
import FormContainer from "@/components/common/formContainer";
import ResetButton from "@/components/common/resetButton";

export default function Component() {
  const [options, setOptions] = useState({});
  const [data, setData] = useState({
    originState: "",
    destinationState: "",
    itemType: "",
    carrierName: "",
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools-options?tool_name=interstate-compliance-checker`
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=interstate-compliance-checker`,
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
          title="Interstate Compliance Checker"
          description="Generate a Customized Regulatory Checklist for State-to-State Parcel Shipments"
        >
          <InterstateComplianceCheckerInputForm
            loading={loading === "results"}
            options={options}
            data={data}
            handleSubmit={fetchResults}
          />
        </FormContainer>
      </div>
    );

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Interstate Compliance Checker</h1>

      <ResetButton resetResults={() => setResults(undefined)} />

      <InterstateComplianceCheckerOutput {...results} />
    </div>
  );
}
