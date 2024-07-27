"use client";

import { Subscription } from "./page";

import Cards, { Focused } from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import { useEffect, useState } from "react";

import { CheckIcon, X } from "lucide-react";
import { SaveCardForm } from "./forms/save-card-form";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatSignedDate, formatToUTC } from "@/utils/formatDate";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import useModal from "@/hooks/use-modal";
import { Badge } from "@/components/ui/badge";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

interface ChargeSubscriptionProps {
  subscription: Subscription;
}

export interface Plan {
  id: string;
  name: string;
  active: boolean;
  value: number;
  trialDays: number;
  durationInMonths: number;
  public: boolean;
  canIntegrate: boolean;
  qtdReports: number;
  qtdProjects: number;
}

interface Card {
  lastNumbers: string;
  expYear: number;
  expMonth: number;
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

export function ChargeSubscription({ subscription }: ChargeSubscriptionProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [openChangePayment, setOpenChangePayment] = useState(false);
  const [planSelectedId, setPlanSelectedId] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  const {
    isOpen: isOpenCancelSubscription,
    onOpenChange: onOpenCancelSubscription,
  } = useModal();
  const {
    isOpen: isOpenChangeSubscription,
    onOpenChange: onOpenChangeSubscription,
  } = useModal();
  const {
    isOpen: isOpenChangeSubscriptionConfirmation,
    onOpenChange: onOpenChangeSubscriptionConfirmation,
  } = useModal();

  const {
    isOpen: isOpenChangeChargeCard,
    onOpenChange: onOpenChangeChargeCard,
  } = useModal();

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    name: "",
    cvc: "",
  });

  function handleSelectPlan(planId: string) {
    handleChangeSubscription(planId);
    onOpenChangeSubscriptionConfirmation();
  }

  async function handleCancelUserSubscription() {
    const response = await fetchApi(
      `/subscription/cancel/${subscription.user.id}`, // id do usuário
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      const responseError = await response.json();

      toast.error(responseError.error,{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Assinatura cancelada com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    window.location.reload();
  }

  async function getPlans() {
    const response = await fetchApi(`/plans/fetch/available-to-upgrade`);

    if (!response.ok) {
      toast.error("Não foi possivel buscar os planos para esse usuário",{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    const data = await response.json();

    setPlans(data);
  }

  async function getUserCard() {
    const response = await fetchApi(
      `/subscription/card/${subscription.user.id}`
    );

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error,{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    const data = await response.json();

    const { card } = data;

    const expMonth = String(card.expMonth).padStart(2, "0");

    setCard({
      expiry: `${expMonth}${card.expYear}`,
      cvc: "",
      name: subscription.user.name,
      number: `************${card.lastNumbers}`,
    });
  }

  async function handleChangeSubscription(planId: string) {
    setPlanSelectedId(planId);
  }

  async function handleAssignPlanToUser() {
    const requestData = {
      planId: planSelectedId,
    };

    const response = await fetchApi(
      `/subscription/assign/${subscription.user.id}`,
      {
        method: "POST",
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      toast.error("Erro ao associar plano",{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    toast.success("Plano associado com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    window.location.reload();
  }

  async function getPayments() {
    const response = await fetchApi(`/payment/${subscription.user.id}`);

    if (!response.ok) {
      return;
    }

    const resp = await response.json();

    setPayments(resp);
  }

  useEffect(() => {
    getPlans();
    getUserCard();
    getPayments();
  }, []);

  const hasPayments = payments.length > 0;

  return (
    <Elements stripe={stripePromise}>
      <div className="pb-8">
        <p className="text-3xl mb-4">Plano atual</p>
        <div className="w-full grid grid-cols-3 items-start gap-2">

          <Card className="w-full col-span-2 max-w-none">
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
            <CardFooter className="flex justify-between">
              <Button variant="destructive" onClick={onOpenCancelSubscription}>
                Cancelar assinatura
              </Button>

              <Button onClick={onOpenChangeSubscription}>
                Alterar plano
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle>Cartão de Crédito</CardTitle>
            </CardHeader>
            <CardContent className="w-full flex flex-col items-center justify-start gap-2 py-[1.4rem]">
              <Cards
                number={card.number}
                expiry={card.expiry}
                cvc={card.cvc}
                name={card.name}
                preview
              />
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                onClick={onOpenChangeChargeCard}
              >
                Alterar forma de pagamento
              </Button>
            </CardFooter>
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

        <AlertDialog
          open={isOpenCancelSubscription}
          onOpenChange={onOpenCancelSubscription}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza disso ?</AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a cancelar a assinatura deste usuário. Esta
                ação encerrará o acesso aos serviços premium. Deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelUserSubscription}>
                Confirmar Cancelamento
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={isOpenChangeSubscriptionConfirmation}
          onOpenChange={onOpenChangeSubscriptionConfirmation}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza disso ?</AlertDialogTitle>
              <AlertDialogDescription>
                Você está prestes a mudar o plano de assinatura deste usuário.
                Esta ação ajustará o acesso aos serviços conforme o novo plano
                selecionado. Deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleAssignPlanToUser}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog
          open={isOpenChangeSubscription}
          onOpenChange={onOpenChangeSubscription}
        >
          <DialogContent className="sm:max-w-[600px]">
            <ScrollArea className="max-h-[628px]">
              <div className="p-4 flex flex-col gap-4">
                <DialogHeader>
                  <DialogTitle>Faça um Upgrade no Seu Plano</DialogTitle>
                  <DialogDescription>
                    Escolha o plano que melhor atende às suas necessidades.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 md:grid-cols-2 ">
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
                            className="w-full"
                            onClick={() => handleSelectPlan(plan.id)}
                          >
                            Selecionar
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <div>
                    <Button type="button" onClick={onOpenChangeSubscription}>
                      Cancelar
                    </Button>
                  </div>
                </DialogFooter>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isOpenChangeChargeCard}
          onOpenChange={onOpenChangeChargeCard}
        >
          <DialogContent className="sm:max-w-[600px] max-h-[628px] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Alterar forma de pagamento</DialogTitle>
              <DialogDescription>
                Você está prestes a alterar a forma de pagamento da sua
                assinatura. Esta ação atualizará o cartão de cobrança utilizado
                para futuras faturas. Deseja continuar?
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-[220px] py-4">
              <SaveCardForm userId={subscription.user.id} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Elements>
  );
}
