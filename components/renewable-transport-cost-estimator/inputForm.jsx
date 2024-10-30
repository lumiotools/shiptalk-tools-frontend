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
  routeDistance: z.number().min(1, "Route distance must be greater than 0"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
});

const RenewableTransportCostEstimatorInputForm = ({ loading, data, handleSubmit }) => {
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
        {/* Route Distance */}
        <FormField
          control={form.control}
          name="routeDistance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Route Distance (miles)</FormLabel>
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

        {/* Vehicle Type */}
        <FormField
          control={form.control}
          name="vehicleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="electricVehicle">Electric Vehicle</SelectItem>
                  <SelectItem value="hydrogenVehicle">Hydrogen Vehicle</SelectItem>
                  <SelectItem value="biofuelVehicle">Biofuel Vehicle</SelectItem>
                </SelectContent>
              </Select>
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

export default RenewableTransportCostEstimatorInputForm;
