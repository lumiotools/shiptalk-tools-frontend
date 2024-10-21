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

const formSchema = z.object({
  business_model: z.string().min(1, "Business model is required"),
  key_products: z.array(z.string()).min(1, "Product is required"),
  customer_segments: z.array(z.string()).min(1, "Customer segment is required"),
  average_order_values: z
    .array(
      z.object({
        customer_segment: z.string().min(1, "Customer segment is required"),
        cost: z.number().min(1, { message: "Cost is required" }),
      })
    )
    .min(1, "At least one customer segment is required"),

  supply_chain_costs: z.object({
    Manufacturing: z.number().min(1, "Manufacturing cost is required"),
    Warehousing: z.number().min(1, "Warehousing cost is required"),
    Distribution: z.number().min(1, "Distribution cost is required"),
  }),
  user_goals: z.array(z.string()).min(1, "User goal is required"),
  challenges: z.array(z.string()).min(1, "Challenge is required"),
});

const CostToServeAnalysisToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}: {
  loading: boolean;
  options: {
    business_model: string[];
    user_goals: string[];
    challenges: string[];
  };
  data: any;
  handleSubmit: any;
}) => {
  const [keyProducts, setKeyProducts] = useState(
    Math.max(data.key_products.length, 2)
  );

  const [averageOrderValues, setAverageOrderValues] = useState(
    Math.max(data.average_order_values.length, 2)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    handleSubmit(values);
  }

  const onError = (error: any) => {
    console.log(error);
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
          name="business_model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a business model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.business_model.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Array(keyProducts)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-8">
                <FormField
                  control={form.control}
                  name={`key_products.${index}`}
                  render={({ field }) => (
                    <FormItem className="w-full flex-1">
                      <FormLabel>Product {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Product" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="destructive"
                  className="md:mt-8"
                  onClick={() => {
                    if (keyProducts <= 2) return;

                    form.setValue(
                      "key_products",
                      form
                        .getValues("key_products")
                        .filter((_, i) => i !== index)
                    );
                    setKeyProducts(keyProducts - 1);
                  }}
                >
                  <X /> <span className="md:hidden">Remove Product</span>
                </Button>
              </div>
            ))}
        </div>

        <Button
          type="button"
          className="w-full md:w-fit md:mx-auto"
          onClick={() => setKeyProducts(keyProducts + 1)}
        >
          <Plus /> Add More Products
        </Button>

        {Array(averageOrderValues)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-8">
              <FormField
                control={form.control}
                name={`average_order_values.${index}.customer_segment`}
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel>Customer Segment</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Customer Segment"
                        onChange={(e) => {
                          form.setValue(
                            `customer_segments.${index}`,
                            e.target.value
                          );
                          field.onChange({ target: { value: e.target.value } });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`average_order_values.${index}.cost`}
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormLabel>Average Cost</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Average Cost"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                className="md:mt-8"
                onClick={() => {
                  if (averageOrderValues <= 2) return;

                  form.setValue(
                    "customer_segments",
                    form
                      .getValues("customer_segments")
                      .filter((_, i) => i !== index)
                  );

                  form.setValue(
                    "average_order_values",
                    form
                      .getValues("average_order_values")
                      .filter((_, i) => i !== index)
                  );
                  setAverageOrderValues(averageOrderValues - 1);
                }}
              >
                <X /> <span className="md:hidden">Remove Customer Segment</span>
              </Button>
            </div>
          ))}

        <Button
          type="button"
          className="w-full md:w-fit md:mx-auto"
          onClick={() => setAverageOrderValues(averageOrderValues + 1)}
        >
          <Plus /> Add More Customer Segment
        </Button>

        <div className="flex flex-col md:flex-row gap-8">
          <FormField
            control={form.control}
            name="supply_chain_costs.Manufacturing"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Manufacturing Cost</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supply_chain_costs.Warehousing"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Warehousing Cost</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supply_chain_costs.Distribution"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Distribution Cost</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="user_goals"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">User Goals</FormLabel>
                <FormDescription>
                  Select the user goals that apply to your business.
                </FormDescription>
              </div>
              {options.user_goals.map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name="user_goals"
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="challenges"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Challenges</FormLabel>
                <FormDescription>
                  Select the challenges that your business faces.
                </FormDescription>
              </div>
              {options.challenges.map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name="challenges"
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

export default CostToServeAnalysisToolInputForm;
