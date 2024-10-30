import React from "react";
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
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { LoaderCircle, X, Plus } from "lucide-react";

const formSchema = z.object({
  company_size: z.string().min(1, "Company size is required"),
  industry_sector: z.string().min(1, "Industry sector is required"),
  current_sales_data: z
    .array(
      z.object({
        month: z.string().min(1, "Month is required"),
        sales: z.number().min(1, "Sales is required"),
      })
    )
    .min(1, "Current sales data is required"),

  inventory_levels: z
    .array(
      z.object({
        name: z.string().min(1, "Product name is required"),
        quantity: z.number().min(1, "Quantity is required"),
      })
    )
    .min(1, "Current sales data is required"),

  operational_constraints: z
    .array(z.string().min(1, "Operational constraints is required"))
    .min(1, "Operational constraints is required"),
  user_objectives: z
    .array(z.string().min(1, "User objectives is required"))
    .min(1, "User objectives is required"),

  current_challenges: z
    .array(z.string().min(1, "Current challenge is required"))
    .min(1, "Current challenge is required"),

  seasonal_factors: z
    .array(
      z.object({
        factor: z.string().min(1, "Seasonal factor is required"),
      })
    )
    .min(1, "Seasonal factors are required"),
  budget_constraints: z.number().min(1, "Budget constraints is required"),
});

const SalesAndOperationsPlanningToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  const {
    fields: salesFields,
    append: appendSales,
    remove: removeSales,
  } = useFieldArray({
    name: "current_sales_data",
    control: form.control,
  });

  const {
    fields: inventoryFields,
    append: appendInventory,
    remove: removeInventory,
  } = useFieldArray({
    name: "inventory_levels",
    control: form.control,
  });

  const {
    fields: seasonalFields,
    append: appendSeasonal,
    remove: removeSeasonal,
  } = useFieldArray({
    name: "seasonal_factors",
    control: form.control,
  });

  function onSubmit(values) {
    handleSubmit(values);
  }

  const onError = () => {
    console.log(form.getValues());
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="company_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.company_size.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
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
            name="industry_sector"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry Sector</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry sector" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.industry_sector.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
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
            name="budget_constraints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Constraints (in USD)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h2 className="font-semibold text-lg underline">Previous Sales Data</h2>

        {salesFields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-4">
            <FormField
              control={form.control}
              name={`current_sales_data.${index}.month`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`current_sales_data.${index}.sales`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Sales</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => {
                if (salesFields.length <= 2) return;
                removeSales(index);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          className="w-fit mx-auto gap-2"
          onClick={() => appendSales({ month: "", sales: 0 })}
        >
          <Plus className="h-4 w-4" />
          Add Sales Data
        </Button>

        <h2 className="font-semibold text-lg underline">Inventory Details</h2>

        {inventoryFields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-4">
            <FormField
              control={form.control}
              name={`inventory_levels.${index}.name`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`inventory_levels.${index}.quantity`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => {
                if (salesFields.length <= 2) return;
                removeInventory(index);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          className="w-fit mx-auto gap-2"
          onClick={() => appendInventory({ name: "", quantity: 0 })}
        >
          <Plus className="h-4 w-4" />
          Add Inventory Item
        </Button>

        <h2 className="font-semibold text-lg underline">Seasonal Factors</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {seasonalFields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-4">
              <FormField
                control={form.control}
                name={`seasonal_factors.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Factor {index + 1}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value.factor}
                        onChange={(e) =>
                          field.onChange({ factor: e.target.value })
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
                size="icon"
                onClick={() => {
                  if (seasonalFields.length <= 1) return;
                  removeSeasonal(index);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          className="w-fit mx-auto gap-2"
          onClick={() => appendSeasonal({ factor: "" })}
        >
          Add Seasonal Factor
        </Button>

        <FormField
          control={form.control}
          name="operational_constraints"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  Operational Constraints
                </FormLabel>
                <FormDescription>
                  Select the constraints you want to consider.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.operational_constraints.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="operational_constraints"
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
                          <FormLabel className="font-normal leading-5">
                            {item}
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
          name="user_objectives"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">User Objectives</FormLabel>
                <FormDescription>
                  Select the objectives you want to achieve.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <FormLabel className="font-normal leading-5">
                            {item}
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
          name="current_challenges"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Current Challenges</FormLabel>
                <FormDescription>
                  Select the challenges you are currently facing.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.current_challenges.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="current_challenges"
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
                          <FormLabel className="font-normal leading-5">
                            {item}
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

        <Button className="w-full gap-2" type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default SalesAndOperationsPlanningToolInputForm;
