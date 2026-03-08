"use client";

import { useActionState } from "react";
import { seedDemoItems } from "@/app/actions/seed";
import { Button } from "@/components/ui/button";

export function SeedButton() {
  const [state, formAction] = useActionState(seedDemoItems, {
    error: null,
    message: "",
  });

  return (
    <form action={formAction}>
      <Button type="submit" variant="outline" size="sm">
        Seed demo items
      </Button>
      {state?.error && (
        <p className="mt-1 text-destructive text-xs">{state.error}</p>
      )}
    </form>
  );
}
