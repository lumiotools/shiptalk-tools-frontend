import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoaderCircle, Plus, X } from "lucide-react";

const formSchema = z.object({
  business_model: z.string().min(1, "Business model is required"),
  customer_segments: z.array(z.string()).min(1, "Customer segment is required"),
  total_supply_chain_cost: z
    .number()
    .min(1, "Total supply chain cost is required"),
  average_order_value: z.number().min(1, "Average order value is required"),
  user_goals: z.array(z.string()).min(1, "User goal is required"),
  challenges: z.array(z.string()).min(1, "Challenge is required"),
  industry_type: z.string().min(1, "Industry type is required"),
  geographical_scope: z.string().min(1, "Geographical scope is required"),
});

const CostToServeAnalysisToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}) => {
  const [customerSegments, setCustomerSegments] = useState(
    Math.max(data.customer_segments.length, 2)
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  function onSubmit(values) {
    handleSubmit(values);
  }

  const onError = (error) => {
    console.log(form.getValues());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        <FormField
          control={form.control}
          name="business_model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a business model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.business_model.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array(customerSegments)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-8">
                <FormField
                  control={form.control}
                  name={`customer_segments.${index}`}
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>Customer Segment {index + 1}</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer segment" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {options.customer_segments.map((segment) => (
                            <SelectItem key={segment} value={segment}>
                              {segment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="md:mt-8"
                  onClick={() => {
                    if (customerSegments <= 2) return;

                    form.setValue(
                      "customer_segments",
                      form
                        .getValues("customer_segments")
                        .filter((_, i) => i !== index)
                    );
                    setCustomerSegments(customerSegments - 1);
                  }}
                >
                  <X /> <span className="md:hidden">Remove Segment</span>
                </Button>
              </div>
            ))}
        </div>

        <Button
          type="button"
          className="w-full md:w-fit md:mx-auto"
          onClick={() => setCustomerSegments(customerSegments + 1)}
        >
          <Plus /> Add More Segment
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="total_supply_chain_cost"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Total Supply Chain Cost</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Total Supply Chain Cost"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="average_order_value"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Average Order Value</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Average Order Value"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="user_goals"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">User Goals</FormLabel>
                  <FormDescription>
                    Select the user goals that apply to your business.
                  </FormDescription>
                </div>
                {options.user_goals.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="user_goals"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="challenges"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Challenges</FormLabel>
                  <FormDescription>
                    Select the challenges that your business faces.
                  </FormDescription>
                </div>
                {options.challenges.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="challenges"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="industry_type"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Industry Type</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry type" />
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent>
                    {options.industry_type.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="geographical_scope"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Geographic Scope</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select geographic scope" />
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent>
                    {options.geographical_scope.map((scope) => (
                      <SelectItem key={scope} value={scope}>
                        {scope}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full gap-2" type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CostToServeAnalysisToolInputForm;
