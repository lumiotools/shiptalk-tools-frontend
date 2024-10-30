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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

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
        className="w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>

        <FormField
          control={form.control}
          name="urgencyLevel"
          render={({ field }) => (
            <FormItem className="w-full flex-1">
              <FormLabel>Urgency Level</FormLabel>
              <FormControl>
                <RadioGroup
                  className="h-10 flex items-center gap-8"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {options.urgencyLevel.map((level, index) => (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={level}
                        id={`urgency_${level}`}
                      />
                      <Label htmlFor={`urgency_${level}`}>
                        {level}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          className="w-fit ml-auto gap-2"
          type="submit"
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin" />}
          Analyze Cost Impact
        </Button>
      </form>
    </Form>
  );
};

export default DeliveryFrequencyCostImpactAnalyzerInputForm;
