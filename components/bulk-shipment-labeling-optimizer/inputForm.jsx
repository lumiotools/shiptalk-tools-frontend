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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

// Schema for form validation
const formSchema = z.object({
  packageSize: z.string().min(1, "Package type is required"),
  carrier: z.string().min(1, "Carrier is required"),
  numberOfLabels: z.number().min(1, "Number of labels is required"),
  shippingType: z.string().min(1, "Shipping type is required"),
});

const BulkShipmentLabelingOptimizerInputForm = ({
  loading,
  data,
  options,
  handleSubmit,
}) => {
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
        className="w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="carrier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carrier Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., DHL, FedEx" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfLabels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Labels</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Number of Labels"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shipping type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.shippingType.map((type) => (
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
        </div>
        <FormField
          control={form.control}
          name="packageSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Size</FormLabel>
              <FormControl>
                <RadioGroup
                  className="h-10 flex items-center gap-8"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {options.packageSize.map((size, index) => (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={`size_${size}`} />
                      <Label htmlFor={`size_${size}`}>{size}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-fit ml-auto gap-2"
          type="submit"
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin" />}
          Optimize Labeling
        </Button>
      </form>
    </Form>
  );
};

export default BulkShipmentLabelingOptimizerInputForm;
