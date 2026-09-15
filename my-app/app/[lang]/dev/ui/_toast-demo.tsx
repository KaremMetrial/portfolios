"use client";

import { Button } from "@/components/ui/button";
import { Toaster, useToast } from "@/components/ui/toast";

/** Toast demo for `/dev/ui`. */
export function ToastDemo() {
  const toast = useToast();

  return (
    <>
      <Toaster />
      <Button
        magnetic
        onClick={() =>
          toast({
            title: "Saved",
            description: "Your profile is up to date.",
            tone: "success",
          })
        }
      >
        Success toast
      </Button>
      <Button
        magnetic
        variant="ghost"
        onClick={() =>
          toast({
            title: "Error",
            description: "Something went wrong.",
            tone: "danger",
          })
        }
      >
        Danger toast
      </Button>
    </>
  );
}
