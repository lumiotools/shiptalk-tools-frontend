import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const deliveryLocationSchema = z.object({
  location: z.string().min(1, "Location is required"),
  deliveryTime: z.string().min(1, "Delivery time is required"),
});

const formSchema = z.object({
  deliveryLocations: z
    .array(deliveryLocationSchema)
    .min(1, "At least one delivery location is required"),
  urgencyLevel: z.string().min(1, "Urgency level is required"),
});

export default function Component({ loading, options, data, handleSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deliveryLocations:
        data.deliveryLocations.length > 0
          ? data.deliveryLocations
          : [{ location: "", deliveryTime: "" }],
      urgencyLevel: data.urgencyLevel,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "deliveryLocations",
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
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Delivery Location {index + 1}
              </h3>
              <Button
                type="button"
                size="icon"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(index);
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name={`deliveryLocations.${index}.location`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`deliveryLocations.${index}.deliveryTime`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Time</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" />
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
          className="w-fit mr-auto gap-2 h-6 p-0"
          onClick={() => {
            append({ location: "", deliveryTime: "" });
          }}
        >
          <Plus className="h-4 w-4" /> Add Delivery Location
        </Button>

        <FormField
          control={form.control}
          name="urgencyLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urgency Level</FormLabel>
              <FormControl>
                <RadioGroup
                  className="h-10 flex items-center gap-4 md:gap-6"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {options.urgencyLevel.map((level, index) => (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={level} id={`urgency_${level}`} />
                      <Label htmlFor={`urgency_${level}`}>{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-fit ml-auto gap-2" type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          Minimize Parking Fees
        </Button>
      </form>
    </Form>
  );
}
