import React, { useState } from "react";
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
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

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

  shippingCostPerUnit: z.number().min(1, "Shipping cost per unit is required"),
  bulkDiscountRate: z.number().min(1, "Bulk discount rate is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
});

const FreightConsolidationToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}) => {
  const [orders, setOrders] = useState(Math.max(data.orders.length, 2));

  const [carrierOptions, setCarrierOptions] = useState(
    Math.max(data.carrierOptions.length, 1)
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
        {Array(orders)
          .fill(null)
          .map((_, orderIndex) => (
            <div key={orderIndex} className="flex flex-col gap-8">
              <div className="w-full flex-1 flex flex-col md:flex-row gap-8 items-center">
                <h2 className="flex-1 underline text-lg font-semibold">
                  Order {orderIndex + 1} Details
                </h2>

                <Button
                  type="button"
                  size="icon"
                  onClick={() => {
                    if (orders <= 2) return;

                    form.setValue(
                      "orders",
                      form.getValues("orders").filter((_, i) => i !== orderIndex)
                    );
                    setOrders(orders - 1);
                  }}
                >
                  <X /> 
                </Button>
              </div>

              <div className="w-full flex-1 flex flex-col md:flex-row gap-8">
                <FormField
                  control={form.control}
                  name={`orders.${orderIndex}.destinationAddress`}
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
                  name={`orders.${orderIndex}.originAddress`}
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
                  name={`orders.${orderIndex}.orderWeight`}
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
                  name={`orders.${orderIndex}.serviceType`}
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>Service Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          className="h-10 flex items-center gap-8"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          {options.serviceType.map((type, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={type}
                                id={`service_${orderIndex}_${type}`}
                              />
                              <Label htmlFor={`service_${orderIndex}_${type}`}>{type}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}

        <Button
          type="button"
          variant="link"
          className="w-fit mr-auto h-6 p-0"
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
                  <X /> 
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
          variant="link"
          className="w-fit mr-auto h-6 p-0"
          onClick={() => setCarrierOptions(carrierOptions + 1)}
        >
          <Plus /> Add More Carrier
        </Button>

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
                <FormLabel>Bulk Discount Rate (%)</FormLabel>
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
                <FormControl>
                        <RadioGroup
                          className="h-10 flex items-center gap-8"
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          {options.priorityLevel.map((level, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={level}
                                id={`priority_${level}`}
                              />
                              <Label htmlFor={`priority_${level}`}>{level}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-fit ml-auto gap-2" type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          Consolidate Shipments
        </Button>
      </form>
    </Form>
  );
};

export default FreightConsolidationToolInputForm;
