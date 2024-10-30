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

// Schema for form validation
const formSchema = z.object({
  deliveryLocations: z.array(z.string().min(1)).min(1, "At least one delivery location is required"),
  deliveryTimes: z.array(z.string().min(1)).min(1, "At least one delivery time is required"),
  urgencyLevel: z.string().min(1, "Urgency level is required"),
});

const UrbanParkingFeeMinimizerInputForm = ({ loading, data, handleSubmit }) => {
  const [deliveryLocations, setDeliveryLocations] = useState(data.deliveryLocations || [""]);
  const [deliveryTimes, setDeliveryTimes] = useState(data.deliveryTimes || [""]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { ...data, deliveryLocations, deliveryTimes },
  });

  function onSubmit(values) {
    handleSubmit({ ...values, deliveryLocations, deliveryTimes });
  }

  const addLocationField = () => setDeliveryLocations([...deliveryLocations, ""]);
  const removeLocationField = (index) =>
    setDeliveryLocations(deliveryLocations.filter((_, i) => i !== index));

  const addTimeField = () => setDeliveryTimes([...deliveryTimes, ""]);
  const removeTimeField = (index) =>
    setDeliveryTimes(deliveryTimes.filter((_, i) => i !== index));

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        {/* Delivery Locations */}
        <div className="flex flex-col gap-4">
          <FormLabel>Delivery Locations</FormLabel>
          {deliveryLocations.map((location, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={location}
                placeholder="Enter delivery location"
                onChange={(e) => {
                  const newLocations = [...deliveryLocations];
                  newLocations[index] = e.target.value;
                  setDeliveryLocations(newLocations);
                }}
              />
              {index > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => removeLocationField(index)}
                >
                  <X size={18} />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addLocationField}
          >
            <Plus size={18} /> Add Location
          </Button>
          <FormMessage />
        </div>

        {/* Delivery Times */}
        <div className="flex flex-col gap-4">
          <FormLabel>Delivery Times</FormLabel>
          {deliveryTimes.map((time, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={time}
                placeholder="Enter delivery time (e.g., 8:00 AM)"
                onChange={(e) => {
                  const newTimes = [...deliveryTimes];
                  newTimes[index] = e.target.value;
                  setDeliveryTimes(newTimes);
                }}
              />
              {index > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => removeTimeField(index)}
                >
                  <X size={18} />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addTimeField}
          >
            <Plus size={18} /> Add Time
          </Button>
          <FormMessage />
        </div>

        {/* Urgency Level */}
        <FormField
          control={form.control}
          name="urgencyLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urgency Level</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Urgency Level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Express">Express</SelectItem>
                </SelectContent>
              </Select>
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

export default UrbanParkingFeeMinimizerInputForm;
