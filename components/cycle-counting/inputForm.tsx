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
  cycleCountFrequency: z.string().min(1, "Cycle count frequency is required"),
  expectedCount: z.number().min(1, "Expected count is required"),
  currentInventoryLevels: z
    .number()
    .min(1, "Current inventory levels is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
});

const CycleCountingToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}: {
  loading: boolean;
  options: {
    cycleCountFrequency: string[];
    priorityLevel: string[];
  };
  data: any;
  handleSubmit: any;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    handleSubmit(values);
  }

  const onError = (error: any) => {
    console.log(error);
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
          name="cycleCountFrequency"
          render={({ field }) => (
            <FormItem className="w-full flex-1">
              <FormLabel>Cycle Count Frequency</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cycle count frequency" />
                  </SelectTrigger>
                </FormControl>
                <FormMessage />
                <SelectContent>
                  {options.cycleCountFrequency.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>
                      {frequency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expectedCount"
          render={({ field }) => (
            <FormItem className="w-full flex-1">
              <FormLabel>Expected Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentInventoryLevels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Inventory Count</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  {options.priorityLevel.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>
                      {frequency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default CycleCountingToolInputForm;
