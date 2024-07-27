"use client";

import { Subscription } from "./page";
import { useEffect, useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatSignedDate, formatToUTC } from "@/utils/formatDate";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CheckIcon, X } from "lucide-react";

interface FreeSubscriptionProps {
  subscription: Subscription;
}

interface Payment {
  id: string;
  completed: boolean;
  value: number;
  voucher: string;
  paymentDate?: string;
  plan: {
    name: string;
  };
  status: PaymentStatus;
  createdAt: Date;
}

export interface Plan {
  id: string;
  name: string;
  active: boolean;
  value: number;
  trialDays: number;
  durationInMonths: number;
  canIntegrate: boolean;
  qtdReports: number;
  qtdProjects: number;
}

type PaymentStatus = "draft" | "open" | "paid" | "uncollectible" | "void";

const paymentTypes = {
  draft: "Criada",
  open: "Em aberto",
  paid: "Paga",
  uncollectible: "Não recolhida",
  void: "Vazia",
};

const subStatus = {
  active: 'Ativo',
  canceled: 'Cancelado',
  incomplete: 'Incompleto',
  incomplete_expired: 'Expirado',
  past_due: 'Vencido',
  paused: 'Pausado',
  trialing: 'Teste',
  unpaid: 'Pagamento pendente',
};

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
      toast.error(respError.error,{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      setLoadingPlans(false);
      return;
    }

    const data = await response.json();

    const [plan] = data;

    setPlanId(plan.id);

    setPlans(data);
    setLoadingPlans(false);
  }

  function pushToPayment(planId: string) {
    router.push(`/app/subscription/subscription-page?planId=${planId}&customerId=${user?.id}`);
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
    <div className="flex flex-col gap-4 py-8">

      <Card className="w-full col-span-2 max-w-none">
        <CardHeader>
          <CardTitle className="capitalize flex items-center">
            {subscription.plan.name}{" "}
            <Badge className="w-fit ml-4">
              {subStatus[subscription.status]}
            </Badge>
          </CardTitle>
          <CardDescription>
            {formatSignedDate(subscription.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Valor mensal:</span>
            <span className="font-medium">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
                .format(subscription.value / 100)
                .toUpperCase()}
            </span>
          </div>
          <Separator />
          <div>
            <div className="font-medium">Benefícios incluídos:</div>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              {subscription.plan.trialDays > 0 && (
                <li className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-500" />
                  {subscription.plan.trialDays} Dias de período de teste
                </li>
              )}

              <li className="flex items-center gap-2">
                {subscription.plan.canIntegrate ? (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}{" "}
                Tem acesso a integrações
              </li>

              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Poderá criar{" "}
                {subscription.plan.qtdProjects === -1
                  ? "projetos ilimitados"
                  : `${subscription.plan.qtdProjects} projetos`}
              </li>

              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green-500" />
                Poderá criar{" "}
                {subscription.plan.qtdReports === -1
                  ? "reports ilimitados"
                  : `${subscription.plan.qtdReports} reports`}
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {loadingPlans ? (
        <Skeleton className="h-56 w-full" />
      ) : (
        <div>
          <div className="w-full flex flex-col">
            <h3 className="mb-5 mt-5 text-lg font-medium text-gray-900">
              Selecione um plano para fazer parte
            </h3>

            {plans.length > 0 ? (

              <div className="grid gap-6 md:grid-cols-2">
                {plans.map((plan) => {
                  return (
                    <div
                      key={plan.id}
                      className="flex flex-col rounded-lg border border-input bg-background p-6 shadow-sm"
                    >
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold capitalize">
                          {plan.name}
                        </h3>

                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Valor mensal:
                          </span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                              .format(plan.value / 100)
                              .toUpperCase()}
                          </span>
                        </div>
                        <Separator />

                        <ul className="mt-2 space-y-2 text-muted-foreground">
                          {plan.trialDays > 0 && (
                            <li className="flex items-center gap-2 text-sm">
                              <CheckIcon className="h-4 w-4 text-green-500" />
                              {plan.trialDays} Dias de período de teste
                            </li>
                          )}

                          <li className="flex items-center gap-2 text-sm">
                            {plan.canIntegrate ? (
                              <CheckIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}{" "}
                            Tem acesso a integrações
                          </li>

                          <li className="flex items-center gap-2 text-sm">
                            <CheckIcon className="h-4 w-4 text-green-500" />
                            Poderá criar{" "}
                            {plan.qtdProjects === -1
                              ? "projetos ilimitados"
                              : `${plan.qtdProjects} projetos`}
                          </li>

                          <li className="flex items-center gap-2 text-sm">
                            <CheckIcon className="h-4 w-4 text-green-500" />
                            Poderá criar{" "}
                            {plan.qtdReports === -1
                              ? "reports ilimitados"
                              : `${plan.qtdReports} reports`}
                          </li>
                        </ul>
                      </div>
                      <div className="my-6 flex flex-col gap-4" />
                      <div className="mt-auto">
                        <Button
                          className="w-full disabled:cursor-not-allowed"
                          onClick={() => pushToPayment(plan.id)}
                          disabled={plan.value <= 0}
                        >
                          Ir para pagina de pagamento
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <p>Não há planos disponiveis</p>
              </div>
            )}
          </div>
        </div>
      )}

      {hasPayments && (
        <Card className="p-4 mt-8">
          <div className="flex flex-col gap-2">
            <p className="text-xl font-medium mb-4">Meus pagamentos</p>

            {payments.map((payment, planIndex) => (
              <>
                <div
                  key={payment.id}
                  className="py-2 flex items-start justify-between gap-2"
                >
                  <div className="flex flex-col gap-2">
                    <p>Fatura</p>

                    {payment?.paymentDate && (
                      <p className="text-sm">
                        Pago em: {formatToUTC(new Date(payment.paymentDate))}
                      </p>
                    )}

                    <p className="text-sm">
                      Data de Criação: {formatToUTC(payment.createdAt)}
                    </p>

                    <a
                      hrefLang={payment.voucher}
                      href={payment.voucher}
                      target="_blank"
                      className="text-violet-500 hover:text-violet-700 cursor-pointer text-sm"
                    >
                      Ver Fatura
                    </a>
                  </div>

                  <div className="flex flex-col items-start justify-end gap-2">
                    <p>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })
                        .format(payment.value)
                        .toUpperCase()}
                    </p>

                    {payment.status && (
                      <Badge className="w-full flex items-center justify-center">
                        {paymentTypes[payment.status]}
                      </Badge>
                    )}
                  </div>
                </div>

                {payments.length > 1 && planIndex !== payments.length - 1 && (
                  <Separator />
                )}
              </>
            ))}
          </div>
        </Card>
      )}
    </div>
  </>
  );
}
