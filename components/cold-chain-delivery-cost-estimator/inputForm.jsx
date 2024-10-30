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

// Schema for form validation
const formSchema = z.object({
  productType: z.string().min(1, "Product type is required"),
  weatherCondition: z.string().min(1, "Weather condition is required"),
  routeDistance: z.number().min(1, "Route distance must be greater than 0"),
  carrier: z.string().min(1, "Carrier is required"),
  temperatureRequirement: z.number(),
});

const ColdChainDeliveryCostEstimatorInputForm = ({ loading, data, handleSubmit }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  function onSubmit(values) {
    handleSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        {/* Product Type */}
        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Type</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter product type (e.g., Electronics)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Weather Condition */}
        <FormField
          control={form.control}
          name="weatherCondition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weather Condition</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Extreme Heat">Extreme Heat</SelectItem>
                  <SelectItem value="Extreme Cold">Extreme Cold</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Route Distance */}
        <FormField
          control={form.control}
          name="routeDistance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Route Distance (km)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter route distance"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Carrier */}
        <FormField
          control={form.control}
          name="carrier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carrier</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter carrier (e.g., DHL)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Temperature Requirement */}
        <FormField
          control={form.control}
          name="temperatureRequirement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature Requirement (°C)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="e.g., -10"
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full gap-2" type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ColdChainDeliveryCostEstimatorInputForm;
