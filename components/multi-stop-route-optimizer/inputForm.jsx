import { useEffect, useState } from "react";
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

const stopSchema = z.object({
  address: z.string().min(1, "Address is required"),
  parcelType: z.string().min(1, "Parcel type is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
});

const formSchema = z.object({
  stops: z.array(stopSchema).min(1, "At least one stop is required"),
  routeStart: z.string().min(1, "Route start is required"),
  urgencyLevel: z.string().min(1, "Urgency level is required"),
  maxStops: z.number().min(1, "Max stops must be at least 1"),
});

export default function Component({ loading, options, data, handleSubmit }) {
  const [stopCount, setStopCount] = useState(
    Math.max(data.stops?.length || 0, 1)
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
      stops:
        data.stops?.length > 0
          ? data.stops
          : [{ address: "", parcelType: "", priorityLevel: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stops",
  });

  useEffect(() => {
    form.setValue("maxStops", stopCount);
  }, [stopCount]);

  function onSubmit(values) {
    handleSubmit(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Stop {index + 1}</h3>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(index);
                    setStopCount(stopCount - 1);
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FormField
              control={form.control}
              name={`stops.${index}.address`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name={`stops.${index}.parcelType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parcel Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parcel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {options.parcelType.map((type) => (
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
              <FormField
                control={form.control}
                name={`stops.${index}.priorityLevel`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
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
          </div>
        ))}

        <Button
          type="button"
          className="w-fit mx-auto gap-2"
          onClick={() => {
            append({ address: "", parcelType: "", priorityLevel: "" });
            setStopCount(stopCount + 1);
          }}
        >
          <Plus className="h-4 w-4" /> Add Stop
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="routeStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route Start</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter route start address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgencyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgency Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.urgencyLevel.map((level) => (
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
}
