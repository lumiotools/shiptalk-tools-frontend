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

// Schema for form validation
const formSchema = z.object({
  routeDistance: z.number().min(1, "Route distance must be greater than 0"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
});

const RenewableTransportCostEstimatorInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}) => {
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
        className="w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 gap-8">
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
                <FormControl>
                  <RadioGroup
                    className="h-10 flex items-center gap-8"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {options.vehicleType.map((type, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={`type_${type}`} />
                        <Label htmlFor={`type_${type}`}>{type}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          className="w-fit ml-auto gap-2"
          type="submit"
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin" />}
          Estimate Renewable Transport Cost
        </Button>
      </form>
    </Form>
  );
};

export default RenewableTransportCostEstimatorInputForm;
