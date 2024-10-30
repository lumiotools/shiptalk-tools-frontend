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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

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
}) => {
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
        className="w-full flex flex-col gap-8"
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

        <FormField
          control={form.control}
          name="priorityLevel"
          render={({ field }) => (
            <FormItem className="w-full flex-1">
              <FormLabel>Priority Level</FormLabel>
              <FormControl>
                <RadioGroup
                  className="h-10 flex items-center gap-8"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {options.priorityLevels.map((level, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={level}
                        id={`priority_${level}`}
                      />
                      <Label htmlFor={`priority_${level}`}>
                        {level}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trafficConditions"
          render={({ field }) => (
            <FormItem className="w-full flex-1">
              <FormLabel>Traffic Condition</FormLabel>
              <FormControl>
                <RadioGroup
                  className="h-10 flex items-center gap-8"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {options.trafficConditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={condition}
                        id={`traffic_${condition}`}
                      />
                      <Label htmlFor={`traffic_${condition}`}>
                        {condition}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <Button className="w-fit ml-auto gap-2" type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          Optimize Route
        </Button>
      </form>
    </Form>
  );
};

export default DynamicRoutingToolInputForm;
