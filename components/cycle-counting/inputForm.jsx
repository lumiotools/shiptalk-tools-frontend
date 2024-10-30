import React from "react";
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
import { LoaderCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const formSchema = z.object({
  cycleCountFrequency: z.string().min(1, "Cycle count frequency is required"),
  expectedCount: z.number().min(1, "Expected count is required"),
  currentInventoryLevels: z
    .number()
    .min(1, "Current inventory levels is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
});

const CycleCountingToolInputForm = ({
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
        className="w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 gap-8">
          <FormField
            control={form.control}
            name="cycleCountFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cycle Count Frequency</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cycle count frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.cycleCountFrequency.map((frequency) => (
                      <SelectItem key={frequency} value={frequency}>
                        {frequency}
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
            name="expectedCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentInventoryLevels"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Inventory Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                      <div key={index} className="flex items-center space-x-2">
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

        <Button
          className="w-fit ml-auto gap-2"
          type="submit"
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin" />}
          Analyze Cycle Counting
        </Button>
      </form>
    </Form>
  );
};

export default CycleCountingToolInputForm;
