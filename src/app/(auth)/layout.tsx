"use client";

import { useUser } from "@/contexts/user-context";
import { redirectToBase } from "@/utils/routes-after-login";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { user, loadingUser } = useUser();

  if (!loadingUser && user) {
    // fazer uma diferenciação ded acordo com a role do usuário
    redirect(redirectToBase(user.role, user.affiliatedCouncil?.id));
  }

  return (
    <>
      {children}
    </>
  );
}
