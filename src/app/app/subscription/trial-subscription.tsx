"use client";

import { useEffect, useState } from "react";
import { Subscription } from "./page";
import { formatSignedDate, formatToUTC } from "@/utils/formatDate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { Badge } from "@/components/ui/badge";
import { SaveCardForm } from "./forms/save-card-form";
import { loadStripe } from "@stripe/stripe-js";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, X } from "lucide-react";

import { Elements } from "@stripe/react-stripe-js";
import { Skeleton } from "@/components/ui/skeleton";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);


interface FreeSubscriptionProps {
  subscription: Subscription;
}

type PaymentStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';

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


interface Payment {
  id: string;
  completed: boolean;
  value: number;
  voucher: string;
  paymentDate?: string;
  plan: {
    name: string;
  };
  createdAt: Date;
  status: PaymentStatus;
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

  if (loadingUser && !user) {
    return (
      <div className="w-screen h-screen p-8">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <p className="text-3xl mb-4">Plano atual</p>
      <div className="w-full grid grid-cols-2 items-start gap-4 p-2">

        <Card className="w-full h-full max-w-none">
          <CardHeader>
          <CardTitle className="capitalize flex items-center">
                {subscription.plan.name}  <Badge className="w-fit ml-4">{subStatus[subscription.status]}</Badge>
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

        <Card className="col-span-1 h-full">
          <div className="p-4 h-full">
            <SaveCardForm userId={subscription.user.id} />
          </div>
        </Card>
      </div>

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
    </Elements>
  );
}
