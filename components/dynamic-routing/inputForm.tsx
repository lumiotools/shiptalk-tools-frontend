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
import { Textarea } from "../ui/textarea";

export interface DynamicRoutingToolOptions {
  priorityLevels: string[];
  trafficConditions: string[];
  weatherConditions: string[];
}

const formSchema = z.object({
  destinationAddress: z.string().min(1, "Destination address is required"),
  currentLocation: z.string().min(1, "Current location is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
  trafficConditions: z.string().min(1, "Traffic conditions is required"),
  weatherConditions: z.string().min(1, "Weather conditions is required"),
});

const DynamicRoutingToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}: {
  loading: boolean;
  options: DynamicRoutingToolOptions;
  data: {
    destinationAddress: string;
    currentLocation: string;
    priorityLevel: string;
    trafficConditions: string;
    weatherConditions: string;
  };
  handleSubmit: (data: z.infer<typeof formSchema>) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSubmit(values);
  }

  const onError = (error: unknown) => {
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
          name="destinationAddress"
          render={({ field }) => (
            <FormItem className="w-full flex-1">
              <FormLabel>Destination Address</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentLocation"
          render={({ field }) => (
            <FormItem className="w-full flex-1">
              <FormLabel>Current Location</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <FormField
            control={form.control}
            name="priorityLevel"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Priority Level</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent>
                    {options.priorityLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trafficConditions"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Traffic Condition</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select traffic condition" />
                    </SelectTrigger>
                  </FormControl>
                  <FormMessage />
                  <SelectContent>
                    {options.trafficConditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weatherConditions"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
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
                  <FormMessage />
                  <SelectContent>
                    {options.weatherConditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
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

export default DynamicRoutingToolInputForm;
