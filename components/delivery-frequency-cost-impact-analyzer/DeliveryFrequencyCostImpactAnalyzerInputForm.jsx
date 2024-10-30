import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { LoaderCircle } from "lucide-react";

// Define the schema for form validation using Zod
const formSchema = z.object({
  deliveryFrequency: z.number().min(1, "Delivery frequency is required"),
  averageParcelCost: z
    .number()
    .positive("Average parcel cost must be greater than 0")
    .min(0.01, "Average parcel cost is required"),
  routeDistance: z
    .number()
    .positive("Route distance must be greater than 0")
    .min(0.1, "Route distance is required"),
  urgencyLevel: z.string().min(1, "Urgency level is required"),
});

const DeliveryFrequencyCostImpactAnalyzerInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  // Handle form submission
  function onSubmit(values) {
    handleSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Delivery Frequency */}
          <FormField
            control={form.control}
            name="deliveryFrequency"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Delivery Frequency (per week)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Delivery Frequency"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Average Parcel Cost */}
          <FormField
            control={form.control}
            name="averageParcelCost"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Average Parcel Cost ($)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Average Parcel Cost"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Route Distance */}
          <FormField
            control={form.control}
            name="routeDistance"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Route Distance (km)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Route Distance"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Urgency Level */}
          <FormField
            control={form.control}
            name="urgencyLevel"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Urgency Level</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Urgency Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.urgencyLevel.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button className="w-full gap-2" type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default DeliveryFrequencyCostImpactAnalyzerInputForm;
