"use client";
import { useSession } from "next-auth/react";

export function useRole() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as "Admin" | "Manager" | "Staff" | undefined;
  return {
    role,
    canDelete: role === "Admin",
    canEdit: role === "Admin" || role === "Manager",
    canCreate: !!role,
  };
}
