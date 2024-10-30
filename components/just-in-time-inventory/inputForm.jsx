import React from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  average_monthly_demand_units: z
    .number()
    .min(1, "Average monthly demand is required"),

  current_inventory_level_units: z
    .number()
    .min(1, "Current inventory level is required"),

  production_capacity_units_per_month: z
    .number()
    .min(1, "Production capacity is required"),

  warehouse_capacity_units: z.number().min(1, "Warehouse capacity is required"),

  main_objectives: z.array(z.string()).min(1, "User goal is required"),
  current_challenges: z.array(z.string()).min(1, "Challenge is required"),
});

const JustInTimeInventoryToolInputForm = ({
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
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="average_monthly_demand_units"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Average Monthly Demand</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Average Monthly Demand"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_inventory_level_units"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Current Inventory Level</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Current Inventory Level"
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
            name="production_capacity_units_per_month"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Production Capacity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Production Capacity"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="warehouse_capacity_units"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Warehouse Capacity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Warehouse Capacity"
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
          name="main_objectives"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Main Objectives</FormLabel>
                <FormDescription>
                  Select the main objectives that apply to your business
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {options.main_objectives.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="main_objectives"
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
              </div>

              <FormField
                control={form.control}
                name="current_challenges"
                render={() => (
                  <FormItem>
                    <div className="mb-4 mt-8">
                      <FormLabel className="text-base">
                        Current Challenges
                      </FormLabel>
                      <FormDescription>
                        Select the current challenges that apply to your
                        business.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
                      {options.current_challenges.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="current_challenges"
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
                                <FormLabel className="font-normal">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

export default JustInTimeInventoryToolInputForm;
