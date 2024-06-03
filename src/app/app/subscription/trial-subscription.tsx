"use client";

import { useEffect, useState } from "react";
import { Subscription } from "./page";

import { useUser } from "@/contexts/user-context";
import { Subscription as SubscriptionPaymentForm } from "./subscription";
import { fetchApi } from "@/services/fetchApi";
import { Card } from "@/components/ui/card";

interface FreeSubscriptionProps {
  subscription: Subscription;
}

interface Payment {
  id: string;
  completed: boolean;
  value: number;
  voucher: string;
}

export interface Plan {
  id: string;
  name: string;
  active: boolean;
  value: number;
  trialDays: number;
  durationInMonths: number;
}

export function TrialSubscription({
  subscription,
}: FreeSubscriptionProps) {
  const [payments, setPayments] = useState<Payment[]>([]);

  const { user, loadingUser } = useUser();

  async function getPayments() {
    const response = await fetchApi(
      `/payment/${subscription.user.id}`,
    );

    if (!response.ok) {
      return;
    }

    const resp = await response.json();

    setPayments(resp);
  }

  useEffect(() => {
    if (!loadingUser && user?.id) {
      getPayments();
    }
  }, [loadingUser]);

  const hasPayments = payments.length > 0;

  return (
    <>
      <p className="text-3xl mb-4">Plano atual</p>
      <div className="w-full grid grid-cols-2 items-start gap-4 p-2">
        <Card className="flex flex-col gap-4 col-span-1 h-full">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p>{subscription.plan.name}</p>
              <p>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
                  .format(subscription.value / 100)
                  .toUpperCase()}{" "}
                {subscription.plan.durationInMonths > 0 && `/ Cobrado a cada ${subscription.plan.durationInMonths}`}
              </p>

              <span>{subscription.active ? "ativo" : "inativo"}</span>
            </div>
          </div>
        </Card>

        <Card className="col-span-1">
          <div>
            <SubscriptionPaymentForm />
          </div>
        </Card>
      </div>

      {hasPayments && (
        <Card>
          <div className="flex flex-col gap-2">
            <p className="text-xl">Meus pagamentos</p>

            {payments.map((payment) => (
              <Card key={payment.id} className="py-2 flex flex-col gap-2">
                <p className="text-lg">Fatura</p>

                <p>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                    .format(payment.value)
                    .toUpperCase()}
                </p>

                <a
                  hrefLang={payment.voucher}
                  href={payment.voucher}
                  target="_blank"
                  className="text-violet-500 hover:text-violet-700 cursor-pointer"
                >
                  Ver fatura
                </a>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
