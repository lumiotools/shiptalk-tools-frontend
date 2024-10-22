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
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { LoaderCircle, X, Plus } from "lucide-react";

const formSchema = z.object({
  incomingTrucks: z
    .array(
      z.object({
        arrivalTime: z.string().min(1, "Arrival time is required"),
        loadType: z.string().min(1, "Load type is required"),
        quantity: z.number().min(1, "Quantity is required"),
      })
    )
    .min(1, "Incoming trucks data is required"),

  outboundTrucks: z
    .array(
      z.object({
        departureTime: z.string().min(1, "Departure time is required"),
        capacity: z.number().min(1, "Capacity is required"),
      })
    )
    .min(1, "Outbound trucks data is required"),

  docksAvailable: z.number().min(1, "No of available Docs is required"),
  laborAvailable: z.number().min(1, "No of available Labours is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
  trafficConditions: z.string().min(1, "Traffic conditions is required"),
  weatherConditions: z.string().min(1, "Weather conditions is required"),
});

const CrossDockingToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}: {
  loading: boolean;
  options: {
    loadType: string[];
    priorityLevel: string[];
    trafficConditions: string[];
    weatherConditions: string[];
  };
  data: any;
  handleSubmit: any;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  const {
    fields: incomingTrucksFields,
    append: appendIncomingTruck,
    remove: removeIncomingTruck,
  } = useFieldArray({
    name: "incomingTrucks",
    control: form.control,
  });
  const {
    fields: outboundTrucksFields,
    append: appendOutboundTruck,
    remove: removeOutboundTruck,
  } = useFieldArray({
    name: "outboundTrucks",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    
    handleSubmit(values);
  }

  const onError = (error: any) => {
    
    console.log(form.getValues());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        <h2 className="font-semibold text-lg underline">
          Incoming Trucks Details
        </h2>

        {incomingTrucksFields.map((field, index) => (
          <div key={field.id} className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name={`incomingTrucks.${index}.arrivalTime`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Arrival Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="datetime-local" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`incomingTrucks.${index}.loadType`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Load Type</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Load Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.loadType.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`incomingTrucks.${index}.quantity`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="destructive"
              className="md:mt-8"
              onClick={() => {
                if (incomingTrucksFields.length <= 2) return;
                removeIncomingTruck(index);
              }}
            >
              <X className="h-4 w-4" />
              <span className="md:hidden">Remove Truck</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          className="w-fit mx-auto gap-2"
          onClick={() =>
            appendIncomingTruck({ arrivalTime: "", loadType: "", quantity: 0 })
          }
        >
          <Plus className="h-4 w-4" />
          Add Incoming Truck
        </Button>

        <h2 className="font-semibold text-lg underline">
          Outbound Trucks Details
        </h2>

        {outboundTrucksFields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-4">
            <FormField
              control={form.control}
              name={`outboundTrucks.${index}.departureTime`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Departure Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="datetime-local" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`outboundTrucks.${index}.capacity`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="destructive"
              className="md:mt-8"
              onClick={() => {
                if (outboundTrucksFields.length <= 1) return;
                removeOutboundTruck(index);
              }}
            >
              <X className="h-4 w-4" />
              <span className="md:hidden">Remove Truck</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          className="w-fit mx-auto gap-2"
          onClick={() =>
            appendOutboundTruck({ departureTime: "", capacity: 0 })
          }
        >
          <Plus className="h-4 w-4" />
          Add Outbound Truck
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="docksAvailable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Docks Available</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Docks Available"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="laborAvailable"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Labor Available</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Labor Available"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="priorityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority Level</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.priorityLevel.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trafficConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Traffic Conditions</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Traffic Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.trafficConditions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weatherConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weather Conditions</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Weather Conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.weatherConditions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
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

export default CrossDockingToolInputForm;
