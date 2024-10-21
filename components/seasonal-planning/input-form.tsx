"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { Checkbox } from "@/components/ui/checkbox";
import SeasonalPlanningVisualization from "./output";
import { LoaderCircle } from "lucide-react";

const businessTypes = [
  "Retail",
  "E-commerce",
  "Manufacturing",
  "Hospitality",
  "Logistics",
  "Food & Beverage",
  "Fashion",
  "Electronics",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const seasons = ["Spring", "Summer", "Fall", "Winter"];

const constraints = [
  "Budget Limitations",
  "Supplier Constraints",
  "Labor Shortage",
  "Storage Capacity Limits",
  "Regulatory Compliance",
];

const formSchema = z.object({
  business_type: z.string().min(1, "Business type is required"),
  peak_season_periods: z
    .array(z.string())
    .min(1, "At least one peak season period is required"),
  inventory_status: z.record(z.string(), z.number().positive()),
  staffing_levels: z.number().int().positive(),
  logistics_capacity: z.record(z.string(), z.number().positive()),
  expected_demand_increase_percentage: z.number().min(0).max(100),
  constraints: z.array(z.string()).optional(),
});

export default function SeasonalPlanningForm() {
  const [inventoryItems, setInventoryItems] = useState([""]);
  const [logisticsItems, setLogisticsItems] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_type: "",
      peak_season_periods: [],
      inventory_status: {},
      staffing_levels: 0,
      logistics_capacity: {},
      expected_demand_increase_percentage: 0,
      constraints: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=seasonal-planning`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
      setApiResponse(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (apiResponse) {
    return <SeasonalPlanningVisualization data={apiResponse} />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-screen-sm mx-auto bg-black p-8 rounded-md"
      >
        <h2 className="text-2xl">Seasonal Planning</h2>
        <FormField
          control={form.control}
          name="business_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a business type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="peak_season_periods"
          render={() => (
            <FormItem>
              <FormLabel>Peak Season Periods</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {[...months, ...seasons].map((period) => (
                  <FormField
                    key={period}
                    control={form.control}
                    name="peak_season_periods"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={period}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(period)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, period])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== period
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {period}
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

        <FormField
          control={form.control}
          name="inventory_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inventory Status</FormLabel>
              {inventoryItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Product name"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...inventoryItems];
                      newItems[index] = e.target.value;
                      setInventoryItems(newItems);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    onChange={(e) => {
                      const newStatus = { ...field.value };
                      newStatus[item] = parseFloat(e.target.value);
                      field.onChange(newStatus);
                    }}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setInventoryItems([...inventoryItems, ""])}
              >
                Add Product
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="staffing_levels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staffing Levels</FormLabel>
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
          name="logistics_capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logistics Capacity</FormLabel>
              {logisticsItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="Capacity type"
                    value={item}
                    onChange={(e) => {
                      const newItems = [...logisticsItems];
                      newItems[index] = e.target.value;
                      setLogisticsItems(newItems);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Value"
                    onChange={(e) => {
                      const newCapacity = { ...field.value };
                      newCapacity[item] = parseFloat(e.target.value);
                      field.onChange(newCapacity);
                    }}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setLogisticsItems([...logisticsItems, ""])}
              >
                Add Capacity Type
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expected_demand_increase_percentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Demand Increase Percentage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="constraints"
          render={() => (
            <FormItem>
              <FormLabel>Constraints</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {constraints.map((item) => (
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
                                  ? field.onChange([
                                      ...(field.value || []),
                                      item,
                                    ])
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <LoaderCircle className="animate-spin" />} Submit
        </Button>
      </form>
    </Form>
  );
}
