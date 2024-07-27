"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { FreeSubscription } from "./free-subscription";
import { TrialSubscription } from "./trial-subscription";
import { ChargeSubscription } from "./charge-subscription";

type UserPlanStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid';

export interface Subscription {
  active: boolean;
  createdAt: Date;
  value: number;
  id: string;
  status: UserPlanStatus;
  paymentMethodId: string;
  plan: {
    id: string;
    name: string;
    durationInMonths: number;
    value: number;
    trialDays: number;
    canIntegrate: boolean;
    qtdReports: number;
    qtdProjects: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Plan {
  id: string;
  name: string;
  active: boolean;
  value: number;
  trialDays: number;
  durationInMonths: number;
}

export default function Plan() {
  const { user, loadingUser } = useUser();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  async function getUser() {
    const response = await fetchApi(
      `/subscription/${user?.id}`,
    );

    if (!response.ok) {
      const respError = await response.json();

      
      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      setLoading(false);
      return;
    }

    const resp = await response.json();

    setSubscription(resp);

    setLoading(false);
  }


  useEffect(() => {
    if (!loadingUser && user?.id) {
      getUser();
    }
  }, [loadingUser]);

  if (loading) {
    return (
      <div className="w-full h-full p-8">
        <Skeleton className="w-full h-96 p-2" />
      </div>
    );
  }

  if(!loading && !subscription) {
    return (
      <h1>Inscrição não encontrada</h1>
    )
  }

  const freePlan = subscription && subscription.plan.value <= 0;
  const subWithPaymentMethod = subscription && subscription.paymentMethodId;
  const isTrial = subscription && !subWithPaymentMethod && !freePlan

  return (
    <div className="w-full h-full p-8">
      {freePlan && <FreeSubscription subscription={subscription} />}

      {subWithPaymentMethod && (
        <ChargeSubscription subscription={subscription} />
      )}

      { isTrial && <TrialSubscription subscription={subscription} />}
    </div>
  );
}
