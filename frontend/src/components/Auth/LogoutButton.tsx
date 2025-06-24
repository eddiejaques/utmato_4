"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { signOut } = useClerk();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Log out"
      onClick={() => signOut()}
      className="text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive/50"
    >
      <LogOut className="size-5" />
    </Button>
  );
} 