'use client'

import LoadingAnimation from "@/app/app/_components/loading-page";
import { useUser } from "@/contexts/user-context";
import { redirectToBase } from "@/utils/routes-after-login";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface OnlyAdminProps {
  children: ReactNode;
}

export function OnlyAdmin({ children }: OnlyAdminProps) {
  const router = useRouter();
  const { user, loadingUser } = useUser();

  if (loadingUser && !user) {
    return <LoadingAnimation />;
  }

  if (user && user?.role !== "ADMIN") {
    window.location.href = redirectToBase(user.role, user.affiliatedCouncil.id);
  }

  return <>{children}</>;
}
