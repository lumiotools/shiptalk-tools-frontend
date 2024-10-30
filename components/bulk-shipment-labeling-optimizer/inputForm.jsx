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

// Schema for form validation
const formSchema = z.object({
  packageType: z.string().min(1, "Package type is required"),
  carrier: z.string().min(1, "Carrier is required"),
  numberOfLabels: z.number().min(1, "Number of labels is required"),
  shippingType: z.string().min(1, "Shipping type is required"),
});

const BulkShipmentLabelingOptimizerInputForm = ({ loading, data, handleSubmit }) => {
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
        <FormField
          control={form.control}
          name="packageType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Type</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Large, Small" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="carrier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carrier</FormLabel>
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
              <FormControl>
                <Input {...field} placeholder="e.g., International Shipping" />
              </FormControl>
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

export default BulkShipmentLabelingOptimizerInputForm;
