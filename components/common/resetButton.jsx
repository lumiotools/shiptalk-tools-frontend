import React from "react";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";

const ResetButton = ({ resetResults }) => {
  return (
    <Button
      className="ml-0 mr-auto -my-8 text-lg gap-0 !text-muted-foreground hover:!text-primary"
      variant="link"
      onClick={resetResults}
    >
      <ChevronLeft className="!size-6" />
      Back
    </Button>
  );
};

export default ResetButton;
