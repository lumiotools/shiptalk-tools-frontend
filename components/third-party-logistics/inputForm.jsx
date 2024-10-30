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
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoaderCircle } from "lucide-react";

const ThirdPartyLogisticsToolInputForm = ({
  loading,
  options,
  data,
  handleSubmit,
}) => {
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
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="company_size"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>company Size</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company Size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.company_size.map((item) => (
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
            name="shipment_volume_per_month"
            render={({ field }) => (
              <FormItem className="w-full flex-1">
                <FormLabel>Shipment Volume Per Month</FormLabel>
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
          name="logistics_functions_to_outsource"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">
                  Logistics Functions to Outsource
                </FormLabel>
                <FormDescription>
                  Select the logistics functions you want to outsource.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
                {options.logistics_functions_to_outsource.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="logistics_functions_to_outsource"
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
          name="geographic_regions"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Geographic Regions</FormLabel>
                <FormDescription>
                  Select the regions you ship to.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
                {options.geographic_regions.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="geographic_regions"
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
          name="types_of_products"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Product Types</FormLabel>
                <FormDescription>
                  Select the types of products you ship.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
                {options.types_of_products.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="types_of_products"
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
                <FormDescription>Select the user objectives.</FormDescription>
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
          name="constraints"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Constraints</FormLabel>
                <FormDescription>
                  Select the constraints that apply to your business.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
                {options.constraints.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="constraints"
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
                  Select the current challenges that apply to your business
                </FormDescription>
              </div>
              <div className="grid grid-cols-1  md:grid-cols-3 gap-4">
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

export default ThirdPartyLogisticsToolInputForm;
