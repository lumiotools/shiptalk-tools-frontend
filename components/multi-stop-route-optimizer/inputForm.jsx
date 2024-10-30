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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

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
        className="w-full flex flex-col gap-8"
      >
        {fields.map((field, stop) => (
          <div key={field.id} className="flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Delivery Stop {stop + 1}
              </h3>
              <Button
                type="button"
                size="icon"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(stop);
                    setStopCount(stopCount - 1);
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name={`stops.${stop}.address`}
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

              <FormField
                control={form.control}
                name={`stops.${stop}.parcelType`}
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
                name={`stops.${stop}.priorityLevel`}
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
                            className="flex levels-center space-x-2"
                          >
                            <RadioGroupItem
                              value={level}
                              id={`priority_${stop}_${level}`}
                            />
                            <Label htmlFor={`priority_${stop}_${level}`}>
                              {level}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
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
          onClick={() => {
            append({ address: "", parcelType: "", priorityLevel: "" });
            setStopCount(stopCount + 1);
          }}
        >
          <Plus className="h-4 w-4" /> Add Delivery Stop
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="routeStart"
            render={({ field }) => (
              <FormItem className="col-span-2">
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
                <FormControl>
                  <RadioGroup
                    className="h-10 flex items-center gap-8"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {options.urgencyLevel.map((level, index) => (
                      <div key={index} className="flex levels-center space-x-2">
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
        </div>
        <Button
          className="w-fit gap-2 ml-auto"
          type="submit"
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin" />}
          Optimize Route
        </Button>
      </form>
    </Form>
  );
}
