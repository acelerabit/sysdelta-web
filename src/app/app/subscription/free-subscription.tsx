"use client";

import { Subscription } from "./page";
import { useEffect, useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const FormSchema = z.object({
  planId: z.string({
    required_error: "You need to select a plan id.",
  }),
});

export function FreeSubscription({ subscription }: FreeSubscriptionProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [planId, setPlanId] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [disablePaymentButton, setDisablePaymentButton] = useState(true);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [loadingPlans, setLoadingPlans] = useState(true);

  const { user, loadingUser } = useUser();

  const router = useRouter();

  async function getPayments() {
    const response = await fetchApi(`/payment/${subscription.user.id}`);

    if (!response.ok) {
      return;
    }

    const resp = await response.json();

    setPayments(resp);
  }

  async function getAvailablePlans() {
    const response = await fetchApi(`/plans/fetch/available-to-upgrade`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error);
      setLoadingPlans(false);
      return;
    }

    const data = await response.json();

    const [plan] = data;

    setPlanId(plan.id);

    setPlans(data);
    setLoadingPlans(false);
  }

  function pushToPayment() {
    router.push(`/app/subscription/payment?planId=${planId}`);
  }

  function handleSelectPlan(id: string) {
    setPlanId(id);
  }

  function handleDisablePaymentButton() {
    if (!planId) {
      return setDisablePaymentButton(true);
    }

    if (planId === subscription.plan.id) {
      return setDisablePaymentButton(true);
    }

    const planFound = plans.findIndex((plan) => plan.id === planId);

    if (planFound < 0) {
      return setDisablePaymentButton(true);
    }

    if (plans[planFound].value <= 0) {
      return setDisablePaymentButton(true);
    }

    return setDisablePaymentButton(false);
  }

  useEffect(() => {
    getAvailablePlans();
  }, []);

  useEffect(() => {
    handleDisablePaymentButton();
  }, [planId]);

  useEffect(() => {
    if (!loadingUser && user?.id) {
      getPayments();
    }
  }, [loadingUser]);

  const hasPayments = payments.length > 0;

  return (
    <>
      <p className="text-3xl mb-4">Plano atual</p>
      <Card className="flex flex-col gap-4 p-4">
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
              {subscription.plan.durationInMonths > 0 &&
                `/ Cobrado a cada ${subscription.plan.durationInMonths}`}
            </p>

            <span>{subscription.active ? "ativo" : "inativo"}</span>
          </div>
        </div>

        {loadingPlans ? (
          <Skeleton className="h-56 w-full" />
        ) : (
          <div>
            <div className="w-full flex flex-col">
              <h3 className="mb-5 mt-5 text-lg font-medium text-gray-900">
                Selecione um plano para fazer parte
              </h3>

              {plans.length > 0 ? (
                <form className="w-full">
                  <RadioGroup.Root
                    className="w-full flex gap-2.5 p-2"
                    defaultValue={subscription.plan.id}
                  >
                    {plans.map((plan) => (
                      <RadioGroup.Item
                        key={plan.id}
                        className="w-80 border-2 border-zinc-200 group data-[state=checked]:border-violet-500 rounded-md flex flex-col items-center justify-center p-4 gap-2"
                        value={plan.id}
                        id={plan.id}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        <p className="text-xl text-bold text-zinc-400 group-data-[state=checked]:text-violet-500">
                          {plan.name}
                        </p>

                        <p className="text-2xl text-bold text-zinc-400 group-data-[state=checked]:text-violet-500">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                            .format(plan.value / 100)
                            .toUpperCase()}
                        </p>

                        <div className="flex items-center justify-center flex-col gap-2">
                          <p className="text-sm text-bold text-zinc-400 group-data-[state=checked]:text-violet-500">
                            A cada {plan.durationInMonths} meses
                          </p>

                          {plan.trialDays > 0 && (
                            <p className="text-sm text-bold text-zinc-400 group-data-[state=checked]:text-violet-500">
                              {plan.trialDays} dias de periodo de teste grátis
                            </p>
                          )}
                        </div>
                      </RadioGroup.Item>
                    ))}
                  </RadioGroup.Root>

                  <Button
                    className="float-right mt-2"
                    onClick={pushToPayment}
                    disabled={disablePaymentButton}
                    type="button"
                  >
                    Ir para página de pagamento
                  </Button>
                </form>
              ) : (
                <div>
                  <p>Não há planos disponiveis</p>
                </div>
              )}
            </div>
          </div>
        )}

        
        {hasPayments && (
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
        )}
      </Card>
    </>
  );
}
