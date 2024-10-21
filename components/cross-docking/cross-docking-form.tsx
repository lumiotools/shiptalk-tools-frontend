"use client";

import { useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { format, setISODay } from "date-fns";
import { cn } from "@/lib/utils";
import CrossDockingVisualization from "./cross-docking-visualization";

type TruckData = {
  arrivalTime?: Date;
  departureTime?: Date;
  loadType?: string;
  quantity?: number;
  capacity?: number;
};

type FormData = {
  incomingTrucks: TruckData[];
  outboundTrucks: TruckData[];
  docksAvailable: number;
  laborAvailable: number;
  priorityLevel: string;
  trafficConditions: string;
  weatherConditions: string;
};

export default function CrossDockingForm() {
  const [apiResponse, setApiResponse] = useState(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      incomingTrucks: [
        { arrivalTime: new Date(), loadType: "Regular", quantity: 0 },
      ],
      outboundTrucks: [{ departureTime: new Date(), capacity: 0 }],
      docksAvailable: 1,
      laborAvailable: 5,
      priorityLevel: "High",
      trafficConditions: "Heavy",
      weatherConditions: "Storm",
    },
  });

  const {
    fields: incomingFields,
    append: appendIncoming,
    remove: removeIncoming,
  } = useFieldArray({
    control,
    name: "incomingTrucks",
  });

  const {
    fields: outboundFields,
    append: appendOutbound,
    remove: removeOutbound,
  } = useFieldArray({
    control,
    name: "outboundTrucks",
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      // Convert number types to integers
      const processedData = {
        ...data,
        incomingTrucks: data.incomingTrucks.map((truck) => ({
          ...truck,
          quantity: truck.quantity
            ? parseInt(truck.quantity.toString(), 10)
            : undefined,
        })),
        outboundTrucks: data.outboundTrucks.map((truck) => ({
          ...truck,
          capacity: truck.capacity
            ? parseInt(truck.capacity.toString(), 10)
            : undefined,
        })),
        docksAvailable: parseInt(data.docksAvailable.toString(), 10),
        laborAvailable: parseInt(data.laborAvailable.toString(), 10),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat-tools?tool=cross-docking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...processedData,
          }),
        }
      );
      const result = await response.json();
      setApiResponse(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (apiResponse) {
    return <CrossDockingVisualization data={apiResponse} />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 max-w-screen-sm mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>Cross Docking Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Incoming Trucks</h3>
              {incomingFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-wrap items-end gap-4 mt-4"
                >
                  <div className="flex-1 min-w-[100px] overflow-hidden">
                    <Label htmlFor={`incomingTrucks.${index}.arrivalDate`}>
                      Arrival Date
                    </Label>
                    <Controller
                      control={control}
                      name={`incomingTrucks.${index}.arrivalTime`}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-1 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "P")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <Label htmlFor={`incomingTrucks.${index}.loadType`}>
                      Load Type
                    </Label>
                    <Controller
                      control={control}
                      name={`incomingTrucks.${index}.loadType`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select load type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Regular">Regular</SelectItem>
                            <SelectItem value="Bulky">Bulky</SelectItem>
                            <SelectItem value="Fragile/Perishable">
                              Fragile/Perishable
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <Label htmlFor={`incomingTrucks.${index}.quantity`}>
                      Quantity
                    </Label>
                    <Input
                      type="number"
                      {...register(
                        `incomingTrucks.${index}.quantity` as const,
                        { required: true, min: 1 }
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeIncoming(index)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  appendIncoming({
                    arrivalTime: new Date(),
                    loadType: "Regular",
                    quantity: 0,
                  })
                }
                className="mt-4 flex items-center"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Incoming Truck
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium">Outbound Trucks</h3>
              {outboundFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-wrap items-end gap-4 mt-4"
                >
                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor={`outboundTrucks.${index}.departureDate`}>
                      Departure Date
                    </Label>
                    <Controller
                      control={control}
                      name={`outboundTrucks.${index}.departureTime`}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor={`outboundTrucks.${index}.capacity`}>
                      Capacity
                    </Label>
                    <Input
                      type="number"
                      {...register(
                        `outboundTrucks.${index}.capacity` as const,
                        { required: true, min: 1 }
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeOutbound(index)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  appendOutbound({ departureTime: new Date(), capacity: 0 })
                }
                className="mt-4 flex items-center"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Outbound Truck
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="docksAvailable">Docks Available</Label>
                <Input
                  type="number"
                  {...register("docksAvailable", { required: true, min: 1 })}
                />
              </div>
              <div>
                <Label htmlFor="laborAvailable">Labor Available</Label>
                <Input
                  type="number"
                  {...register("laborAvailable", { required: true, min: 1 })}
                />
              </div>
              <div>
                <Label htmlFor="priorityLevel">Priority Level</Label>
                <Select
                  onValueChange={(value) =>
                    register("priorityLevel").onChange({ target: { value } })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="trafficConditions">Traffic Conditions</Label>
                <Select
                  onValueChange={(value) =>
                    register("trafficConditions").onChange({
                      target: { value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select traffic conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weatherConditions">Weather Conditions</Label>
                <Select
                  onValueChange={(value) =>
                    register("weatherConditions").onChange({
                      target: { value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clear">Clear</SelectItem>
                    <SelectItem value="Rainy">Rainy</SelectItem>
                    <SelectItem value="Storm">Storm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit"}
      </Button>

      {formData && (
        <Card>
          <CardHeader>
            <CardTitle>Submitted Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </form>
  );
}
