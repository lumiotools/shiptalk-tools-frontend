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
import { Input } from "@/components/ui/input"
import { LoaderCircle } from "lucide-react"

const formSchema = z.object({
  originState: z.string().min(1, "Origin state is required"),
  destinationState: z.string().min(1, "Destination state is required"),
  itemType: z.string().min(1, "Item type is required"),
  carrierName: z.string().min(1, "Carrier name is required"),
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
            name="originState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origin State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter origin state" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destinationState"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter destination state" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="itemType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Type</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter item type" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="carrierName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carrier Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter carrier name" />
                </FormControl>
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