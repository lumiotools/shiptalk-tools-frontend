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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

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
}) => {
  const [selectedRegions, setSelectedRegions] = useState(
    Math.max(data.warehouseRegions.length, 3)
  );

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
        {Array(selectedRegions)
          .fill(null)
          .map((_, regionIndex) => (
            <div
              key={regionIndex}
              className="w-full flex flex-col md:flex-row gap-8 justify-center"
            >
              <FormField
                control={form.control}
                name={`demandLevels.${regionIndex}.region`}
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel>Warehouse Region</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.setValue(`warehouseRegions.${regionIndex}`, value);
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
                name={`demandLevels.${regionIndex}.demandLevel`}
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel>Demand Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="h-10 flex items-center gap-8"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        {options.demandLevels.map((level, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={level}
                              id={`demain_${regionIndex}_${level}`}
                            />
                            <Label htmlFor={`demain_${regionIndex}_${level}`}>
                              {level}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="button"
                size="icon"
                className="md:mt-8"
                onClick={() => {
                  if (selectedRegions === 0) return;
                  form.setValue(
                    "demandLevels",
                    form.getValues("demandLevels").filter((_, i) => i !== regionIndex)
                  );
                  form.setValue(
                    "warehouseRegions",
                    form
                      .getValues("warehouseRegions")
                      .filter((_, i) => i !== regionIndex)
                  );
                  setSelectedRegions(selectedRegions - 1);
                }}
              >
                <X /> 
              </Button>
            </div>
          ))}

        <Button
          type="button"
          variant="link"
          className="w-fit mr-auto p-0 h-6"
          onClick={() => setSelectedRegions(selectedRegions + 1)}
        >
          <Plus /> Add More Regions
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>

        <Button className="w-fit ml-auto gap-2" type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          Optimize Inventory Distribution
        </Button>
      </form>
    </Form>
  );
};

export default DistributedInventoryToolInputForm;
