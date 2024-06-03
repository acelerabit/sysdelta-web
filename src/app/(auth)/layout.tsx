"use client";

import { useUser } from "@/contexts/user-context";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { user, loadingUser } = useUser();

  if (!loadingUser && user) {
    redirect("/app/dashboard");
  }

  return (
    <>
      {children}
    </>
  );
}
