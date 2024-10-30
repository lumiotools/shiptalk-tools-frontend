import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { cn } from "@/lib/utils";

const FormContainer = ({ title, description, children, className }) => {
  return (
    <Card
      className={cn(
        "max-w-screen-lg w-full shadow-xl shadow-primary/5",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-white text-3xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">{children}</CardContent>
    </Card>
  );
};

export default FormContainer;
