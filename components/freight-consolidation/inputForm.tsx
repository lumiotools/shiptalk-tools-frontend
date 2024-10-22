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
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  orders: z
    .array(
      z.object({
        orderWeight: z.number().min(1, "Order weight is required"),
        destinationAddress: z
          .string()
          .min(1, "Destination address is required"),
        originAddress: z.string().min(1, "Origin address is required"),
        serviceType: z.string().min(1, "Service type is required"),
      })
    )
    .min(1, "Order is required"),

  carrierOptions: z
    .array(
      z.object({
        carrierName: z.string().min(1, "Carrier name is required"),
        carrierCapacity: z.number().min(1, "Carrier capacity is required"),
      })
    )
    .min(1, "Carrier options is required"),

  maxDeliveryTime: z.number().min(1, "Max delivery time is required"),
  consolidationThreshold: z
    .number()
    .min(1, "Consolidation threshold is required"),
  shippingCostPerUnit: z.number().min(1, "Shipping cost per unit is required"),
  bulkDiscountRate: z.number().min(1, "Bulk discount rate is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
});

const FreightConsolidationToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}: {
  loading: boolean;
  options: {
    serviceType: string[];
    priorityLevel: string[];
  };
  data: any;
  handleSubmit: any;
}) => {
  const [orders, setOrders] = useState(Math.max(data.orders.length, 2));

  const [carrierOptions, setCarrierOptions] = useState(
    Math.max(data.orders.length, 1)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
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
        {Array(orders)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex flex-col gap-8">
              <div className="w-full flex-1 flex flex-col md:flex-row gap-8 items-center">
                <h2 className="flex-1 underline text-lg font-semibold">
                  Order {index + 1} Details
                </h2>

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    if (orders <= 2) return;

                    form.setValue(
                      "orders",
                      form.getValues("orders").filter((_, i) => i !== index)
                    );
                    setOrders(orders - 1);
                  }}
                >
                  <X /> <span className="md:hidden">Remove Order</span>
                </Button>
              </div>

              <div className="w-full flex-1 flex flex-col md:flex-row gap-8">
                <FormField
                  control={form.control}
                  name={`orders.${index}.destinationAddress`}
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>Destination Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Destination Address"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`orders.${index}.originAddress`}
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>Origin Address</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Origin Address"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full flex-1 flex flex-col md:flex-row gap-8">
                <FormField
                  control={form.control}
                  name={`orders.${index}.orderWeight`}
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>Order Weight</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Order Weight"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`orders.${index}.serviceType`}
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>Service Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service type" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {options.serviceType.map((type) => (
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
            </div>
          ))}

        <Button
          type="button"
          className="w-full md:w-fit md:mx-auto"
          onClick={() => setOrders(orders + 1)}
        >
          <Plus /> Add More Order
        </Button>

        {Array(carrierOptions)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex flex-col gap-8">
              <div className="w-full flex-1 flex flex-col md:flex-row gap-8 items-center">
                <h2 className="flex-1 underline text-lg font-semibold">
                  Carrier {index + 1} Details
                </h2>

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    if (carrierOptions <= 1) return;

                    form.setValue(
                      "carrierOptions",
                      form
                        .getValues("carrierOptions")
                        .filter((_, i) => i !== index)
                    );
                    setCarrierOptions(carrierOptions - 1);
                  }}
                >
                  <X /> <span className="md:hidden">Remove Carrier Option</span>
                </Button>
              </div>

              <div className="w-full flex-1 flex flex-col md:flex-row gap-8">
                <FormField
                  control={form.control}
                  name={`carrierOptions.${index}.carrierName`}
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>Carrier Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Carrier Name"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`carrierOptions.${index}.carrierCapacity`}
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>Carrier Capacity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Carrier Capacity"
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

        <Button
          type="button"
          className="w-full md:w-fit md:mx-auto"
          onClick={() => setCarrierOptions(carrierOptions + 1)}
        >
          <Plus /> Add More Carrier
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="maxDeliveryTime"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Max Delivery Time</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Max Delivery Time"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consolidationThreshold"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Consolidation Threshold (%)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Consolidation Threshold"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
            name="shippingCostPerUnit"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Shipping Cost Per Unit</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Shipping Cost Per Unit"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bulkDiscountRate"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Bulk Discount Rate</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Bulk Discount Rate"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
            <FormItem>
              <FormLabel>Priority Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.priorityLevel.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default FreightConsolidationToolInputForm;
