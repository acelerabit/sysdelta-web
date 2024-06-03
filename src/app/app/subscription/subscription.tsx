"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { CheckoutForm } from "./forms/checkout-form";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

interface SubscriptionProps {
  planId?: string | null;
}

export function Subscription({ planId = null }: SubscriptionProps) {
  const [loading, setLoading] = useState(true);
  const { user, loadingUser } = useUser();

  const [clientSecret, setClientSecret] = useState("");

  async function getClientSecret() {
    const response = await fetchApi(
      `/payment/create-payment-intent/user/${user?.id}${
        planId ? `?planId=${planId}` : ""
      }`,
    );

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.message);
      setLoading(false);
      return;
    }

    const dataResp = await response.json();

    setClientSecret(dataResp.clientSecret);
    setLoading(false);
  }

  useEffect(() => {
    if (!loadingUser && user?.id) {
      getClientSecret();
    }
  }, [loadingUser]);

  const appearance = {
    theme: "stripe",
  };
  const options: any = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-56 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-64 flex-1" />
          <Skeleton className="h-64 flex-1" />
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div>
        <p>Não foi possivel gerar o formulario de pagamento</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 flex flex-col items-center justify-center">
      <div className="w-full">
        <p className="text-xl mb-4">Adicione o cartão para pagamento</p>

        {clientSecret && user?.id && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm customerId={user.id} planId={planId} />
          </Elements>
        )}
      </div>
    </div>
  );
}
