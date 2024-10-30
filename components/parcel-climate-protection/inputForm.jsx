import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LoaderCircle, Plus, X } from "lucide-react";

const formSchema = z.object({
  productType: z.string().min(1, "Product type is required"),
  climateCondition: z.string().min(1, "Climate condition is required"),
  sensitivityLevel: z.string().min(1, "Sensitivity level is required"),
  carrierOptions: z.array(z.string()).min(1, "At least one carrier is required"),
  urgencyLevel: z.string().min(1, "Urgency level is required"),
});

const ParcelClimateProtectionInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}) => {
  const [carrierCount, setCarrierCount] = useState(
    Math.max(data.carrierOptions?.length || 0, 2)
  );

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
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter product type" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="climateCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Climate Condition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select climate condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.climateCondition.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
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
            name="sensitivityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sensitivity Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sensitivity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.sensitivityLevel.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
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
            name="urgencyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgency Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.urgencyLevel.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array(carrierCount)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name={`carrierOptions.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Carrier {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter carrier name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="mt-8"
                  onClick={() => {
                    if (carrierCount <= 2) return;
                    const currentCarriers = form.getValues("carrierOptions");
                    form.setValue(
                      "carrierOptions",
                      currentCarriers.filter((_, i) => i !== index)
                    );
                    setCarrierCount(carrierCount - 1);
                  }}
                >
                  <X /> <span className="md:hidden">Remove</span>
                </Button>
              </div>
            ))}
        </div>

        <Button
          type="button"
          className="w-full md:w-fit md:mx-auto"
          onClick={() => {
            form.setValue(`carrierOptions.${carrierCount}`, "");
            setCarrierCount(carrierCount + 1);
          }}
        >
          <Plus /> Add More Carriers
        </Button>

        <Button className="w-full gap-2" type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default ParcelClimateProtectionInputForm;
