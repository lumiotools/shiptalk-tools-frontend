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

export interface SeasonalPlanningToolOptions {
  peak_season_periods: string[];
  constraints: string[];
}

const formSchema = z.object({
  peak_season_periods: z
    .array(z.string())
    .min(1, "Peak season period is required"),
  daily_shipments: z.number().min(1, "Daily shipments is required"),
  expected_demand_increase_percentage: z
    .number()
    .min(1, "Expected demand increase percentage is required"),
  available_capacity: z.number().min(1, "Available capacity is required"),
  constraints: z.array(z.string()).min(1, "Constraint is required"),
});

const SeasonalPlanningToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}: {
  loading: boolean;
  options: SeasonalPlanningToolOptions;
  data: {
    peak_season_periods: string[];
    daily_shipments: number;
    expected_demand_increase_percentage: number;
    available_capacity: number;
    constraints: string[];
  };
  handleSubmit: (values: z.infer<typeof formSchema>) => void;
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
          name="peak_season_periods"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Peak Season Periods</FormLabel>
                <FormDescription>
                  Select the peak season periods that apply to your business.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {options.peak_season_periods.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="peak_season_periods"
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="daily_shipments"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Daily Shipments</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Daily Shipments"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expected_demand_increase_percentage"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Expected Demand Increase</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Demand Increase Percentage"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="available_capacity"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Available Capacity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Available Capacity"
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
          name="constraints"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Constraints</FormLabel>
                <FormDescription>
                  Select the constraints that apply to your business.
                </FormDescription>
              </div>{" "}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.constraints.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="constraints"
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

export default SeasonalPlanningToolInputForm;
