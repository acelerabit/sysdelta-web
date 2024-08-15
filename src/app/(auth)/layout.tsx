"use client";

import { useUser } from "@/contexts/user-context";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { user, loadingUser } = useUser();

  if (!loadingUser && user) {
    // fazer uma diferenciação ded acordo com a role do usuário
    redirect("/app");
  }

  return (
    <>
      {children}
    </>
  );
}
