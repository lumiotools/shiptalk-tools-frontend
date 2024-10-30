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
  originZone: z.string().min(1, "Origin zone is required"),
  destinationZone: z.string().min(1, "Destination zone is required"),
  priorityLevel: z.string().min(1, "Priority level is required"),
  productType: z.string().min(1, "Product type is required"),
  estimatedDeliveryDate: z.string().min(1, "Estimated delivery date is required"),
})

export default function Component({ loading, options, data, handleSubmit }) {
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
            name="originZone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin Zone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select origin zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.originZone.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
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
            name="destinationZone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Zone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.destinationZone.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
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

          <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Type</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter product type" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="estimatedDeliveryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Delivery Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
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
  )
}