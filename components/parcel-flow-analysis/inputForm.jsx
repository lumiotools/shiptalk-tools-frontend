import { useState } from "react";
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
import { LoaderCircle } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const formSchema = z.object({
  volume: z.string().min(1, "Volume is required"),
  season: z.string().min(1, "Season is required"),
  type: z.string().min(1, "Type is required"),
  weatherCondition: z.string().min(1, "Weather condition is required"),
  staffAvailability: z.string().min(1, "Staff availability is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
});

const ParcelFlowInputForm = ({ loading, options, data, handleSubmit }) => {
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
        className="max-w-screen-lg w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parcel Type</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your parcel type (e.g. Electronics)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="season"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Season</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter season or month" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="staffAvailability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Staff Availability</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter available staff" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weatherCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weather Condition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select weather condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.weatherConditions.map((item) => (
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
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parcel Volume</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="h-10 flex items-center gap-8"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {options.volume.map((volume, index) => (
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={volume} id={`volume_${volume}`} />
                        <Label htmlFor={`volume_${volume}`}>{volume}</Label>
                      </div>
                    ))}
                  </RadioGroup>
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
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={level} id={`priority_${level}`} />
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

        <Button
          className="w-44 ml-auto gap-2 font-medium"
          type="submit"
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin" />}
          Analyze Parcel Flow
        </Button>
      </form>
    </Form>
  );
};

export default ParcelFlowInputForm;
