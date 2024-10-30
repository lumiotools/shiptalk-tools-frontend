import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LoaderCircle } from "lucide-react"

const formSchema = z.object({
  volume: z.string().min(1, "Volume is required"),
  season: z.string().min(1, "Season is required"),
  type: z.string().min(1, "Type is required"),
  weatherCondition: z.string().min(1, "Weather condition is required"),
  staffAvailability: z.string().min(1, "Staff availability is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
})

const ParcelFlowInputForm = ({ loading, options, data, handleSubmit }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  })

  function onSubmit(values) {
    handleSubmit(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-screen-md w-full flex flex-col gap-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.volume.map((item) => (
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
            name="season"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Season</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter season" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter type" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            name="staffAvailability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Staff Availability</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter staff availability" />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.priorityLevel.map((item) => (
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

        <Button className="w-full gap-2" type="submit" disabled={loading}>
          {loading && <LoaderCircle className="animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default ParcelFlowInputForm