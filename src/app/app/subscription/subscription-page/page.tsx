"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SubscriptionForm } from "../_components/subscription-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

interface SubscriptionProps {
  searchParams: {
    customerId: string;
    planId: string;
  };
}

export default function Subscription({ searchParams }: SubscriptionProps) {
  const { customerId, planId } = searchParams;

  const [clientSecret, setClientSecret] = useState("");
  const [subscriptionId, setSubscriptionId] = useState("");

  async function createAttemptSubscription() {
    if (clientSecret) {
      return;
    }

    const response = await fetchApi(
      `/payment/create-payment/user/${customerId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
        }),
      }
    );

    if (!response.ok) {
      const respError = await response.json();

      toast.error(respError.error);

      window.location.href = "/app/dashboard";

      return;
    }

    const subscription = await response.json();

    setClientSecret(subscription.clientSecret);
    setSubscriptionId(subscription.subscriptionId);
  }

  useEffect(() => {
    // Cria o PaymentIntent e obtém o client secret
    createAttemptSubscription();
  }, [customerId, planId]);

  const options: any = {
    clientSecret,
  };

  if (!clientSecret) {
    console.log("Erro ao carregar secret");
  }

  // if (loading) {
  //   return (
  //     <div className="flex flex-col gap-2">
  //       <Skeleton className="h-56 w-full" />
  //       <div className="flex items-center gap-2">
  //         <Skeleton className="h-64 flex-1" />
  //         <Skeleton className="h-64 flex-1" />
  //       </div>
  //     </div>
  //   );
  // }

  if (!clientSecret) {
    return (
      <div>
        <p>Não foi possivel gerar o formulario de pagamento</p>
      </div>
    );
  }

  return (
    <>
    {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <div className="w-full h-full p-8 flex items-start justify-center">
            <div className="w-[600px]">
              <SubscriptionForm
                customerId={customerId}
                planId={planId}
                clientSecret={clientSecret}
              />
            </div>
          </div>
        </Elements>
      )}
    </>
  );
}
