import React, { useState } from "react";
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

const formSchema = z.object({
  daily_orders: z.number().min(1, "Average monthly demand is required"),
  delivery_locations: z
    .array(z.string().min(1, "Delivery location is required"))
    .min(1, "Delivery locations is required"),
  delivery_method: z.string().min(1, "Delivery method is required"),
  user_objectives: z.array(z.string()).min(1, "User objectives is required"),
  type_of_products: z.array(z.string()).min(1, "Product type is required"),
});

const LastMileDeliverySolutionsToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}) => {
  const [deliveryLocations, setDeliveryLocations] = useState(
    Math.max(data.delivery_locations.length, 2)
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="daily_orders"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Daily Orders</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Daily Orders"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_method"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Delivery Method</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Delivery Method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.delivery_method.map((item) => (
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
          {Array(deliveryLocations)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-8">
                <FormField
                  control={form.control}
                  name={`delivery_locations.${index}`}
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>Delivery Location {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Delivery Location" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  size="icon"
                  className="md:mt-8"
                  onClick={() => {
                    if (deliveryLocations <= 2) return;

                    form.setValue(
                      "delivery_locations",
                      form
                        .getValues("delivery_locations")
                        .filter((_, i) => i !== index)
                    );
                    setDeliveryLocations(deliveryLocations - 1);
                  }}
                >
                  <X />
                </Button>
              </div>
            ))}
        </div>

        <Button
          type="button"
          variant="link"
          className="w-fit mr-auto h-6 p-0"
          onClick={() => setDeliveryLocations(deliveryLocations + 1)}
        >
          <Plus /> Add More Locations
        </Button>

        <FormField
          control={form.control}
          name="user_objectives"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">User Objectives</FormLabel>
                <FormDescription>Select the user objectives</FormDescription>
              </div>
              <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
                {options.user_objectives.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="user_objectives"
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

        <FormField
          control={form.control}
          name="type_of_products"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Type of Products</FormLabel>
                <FormDescription>Select the type of products.</FormDescription>
              </div>
              <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
                {options.type_of_products.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="type_of_products"
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

        <Button
          className="w-fit ml-auto gap-2"
          type="submit"
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin" />}
          Optimize Last-Mile Delivery
        </Button>
      </form>
    </Form>
  );
};

export default LastMileDeliverySolutionsToolInputForm;
