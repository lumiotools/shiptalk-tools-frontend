import React, { useEffect, useState } from "react";
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
import { LoaderCircle, Plus, X } from "lucide-react";

export interface DistributedInventoryToolOptions {
  demandLevels: string[];
  regions: string[];
  productTypes: string[];
}

const formSchema = z.object({
  warehouseRegions: z.array(z.string()).min(1, "Select at least one region"),
  demandLevels: z.array(
    z.object({
      region: z.string(),
      demandLevel: z.enum(["Low", "Medium", "High"]),
    })
  ),
  leadTime: z.number().min(1, "Lead time must be at least 1 day"),
  productType: z.string().min(1, "Product type is required"),
});

const DistributedInventoryToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}: {
  loading: boolean;
  options: DistributedInventoryToolOptions;
  data: {
    warehouseRegions: string[];
    demandLevels: { region: string; demandLevel: "Low" | "Medium" | "High" }[];
    leadTime: number;
    productType: string;
  };
  handleSubmit: (values: z.infer<typeof formSchema>) => void;
}) => {
  const [selectedRegions, setSelectedRegions] = useState(
    Math.max(data.warehouseRegions.length, 3)
  );

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
        {Array(selectedRegions)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="w-full flex flex-col md:flex-row gap-8 justify-center"
            >
              <FormField
                control={form.control}
                name={`demandLevels.${index}.region`}
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel>Warehouse Region</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue(`warehouseRegions.${index}`, value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse region" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {options.regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`demandLevels.${index}.demandLevel`}
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel>Demand Level</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select demand level" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {options.demandLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                className="md:mt-8"
                onClick={() => {
                  if (selectedRegions === 0) return;
                  form.setValue(
                    "demandLevels",
                    form.getValues("demandLevels").filter((_, i) => i !== index)
                  );
                  form.setValue(
                    "warehouseRegions",
                    form
                      .getValues("warehouseRegions")
                      .filter((_, i) => i !== index)
                  );
                  setSelectedRegions(selectedRegions - 1);
                }}
              >
                <X /> <span className="md:hidden">Remove Region</span>
              </Button>
            </div>
          ))}

        <Button
          type="button"
          className="w-full md:w-fit md:mx-auto"
          onClick={() => setSelectedRegions(selectedRegions + 1)}
        >
          <Plus /> Add More Regions
        </Button>

        <FormField
          control={form.control}
          name="leadTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Time (days)</FormLabel>
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
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product type" />
                  </SelectTrigger>
                </FormControl>
                <FormMessage />
                <SelectContent>
                  {options.productTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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

export default DistributedInventoryToolInputForm;
