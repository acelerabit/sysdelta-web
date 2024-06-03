"use client";


import "react-credit-cards-2/dist/es/styles-compiled.css";

import { useEffect, useState } from "react";


import { SaveCardForm } from "@/app/app/subscription/forms/save-card-form";
import { Subscription } from "@/app/app/subscription/page";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import useModal from "@/hooks/use-modal";
import { fetchApi } from "@/services/fetchApi";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

export interface Plan {
  id: string;
  name: string;
  active: boolean;
  value: number;
  trialDays: number;
  durationInMonths: number;
  public: boolean;
}

interface Card {
  lastNumbers: string;
  expYear: number;
  expMonth: number;
}

interface CardDisplay {
  number: string;
  expiry: string;
}

interface UnpaidProps {
  params: {
    userId: string;
  };
}

export default function Unpaid({ params }: UnpaidProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planSelectedId, setPlanSelectedId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const [card, setCard] = useState<CardDisplay | null>(null);

  const {
    isOpen: changePaymentIsOpen,
    onOpenChange: changePaymentOnOpenChange,
  } = useModal();
  const { isOpen: changePlanIsOpen, onOpenChange: changePlanOnOpenChange } =
    useModal();
  const { isOpen: turnFreeIsOpen, onOpenChange: turnFreeOnOpenChange } =
    useModal();

  async function handleCancelUserSubscription() {
    const response = await fetchApi(
      `/subscription/cancel/${params.userId}`,
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      const responseError = await response.json();

      toast.error(responseError.error);
      return;
    }

    toast.success("Assinatura cancelada com sucesso");
    turnFreeOnOpenChange();
    router.replace("/projects");
  }

  async function getPlans() {
    const response = await fetchApi(
      `/plans/fetch/available-to/${params.userId}`
    );

    if (!response.ok) {
      toast.error("Não foi possivel buscar os planos para esse usuário");
      return;
    }

    const data = await response.json();

    setPlans(data);
  }

  async function getUserSub() {
    const response = await fetchApi(`/subscription/${params.userId}`);

    if (!response.ok) {
      toast.error("Não foi possivel buscar a assinatura");
      setLoading(false);
      return;
    }

    const resp = await response.json();

    setSubscription(resp);
    setLoading(false);
  }

  async function getUserCard() {
    const response = await fetchApi(`/subscription/card/${params.userId}`);

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    const { card } = data;

    const expMonth = String(card.expMonth).padStart(2, "0");

    setCard({
      expiry: `${expMonth}/${card.expYear}`,
      number: `**** **** **** ${card.lastNumbers}`,
    });

  }

  async function handleChangeSubscription(planId: string) {
    setPlanSelectedId(planId);
  }

  async function handleAssignPlanToUser() {
    const requestData = {
      planId: planSelectedId,
    };

    const response = await fetchApi(`/subscription/assign/${params.userId}`, {
      method: "POST",
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      toast.error("Erro ao associar plano");
      return;
    }

    toast.success("Plano associado com sucesso");
    changePlanOnOpenChange();
    router.replace("/projects");
  }

  useEffect(() => {
    getPlans();
    getUserCard();
    getUserSub();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full p-8">
        <Skeleton className="w-full h-96 p-2" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-8">
        <h1>Assinatura não encontrada</h1>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="p-8 max-w-5xl m-auto">
        <p className="text-3xl mb-4 text-red-400">
          Seu plano está inativo, mude de plano ou forma de pagamento !!
        </p>
        <Card className="flex flex-col gap-4 p-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p>{subscription?.plan.name}</p>
              <p>
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
                  .format(subscription.value / 100)
                  .toUpperCase()}{" "}
                / Cobrado a cada {subscription.plan.durationInMonths}
              </p>

              <span>{subscription.active ? "ativa" : "inativa"}</span>
              <Button onClick={changePlanOnOpenChange}>Alterar plano</Button>

              {!card && (
                <Button className="w-full" onClick={changePaymentOnOpenChange}>
                  Adicionar forma de pagamento
                </Button>
              )}

              <Button variant="destructive" onClick={turnFreeOnOpenChange}>
                mudar para plano free
              </Button>
            </div>

            {card && (
              <div className="w-80 flex flex-col items-center justify-start gap-2">
                <Card className="w-full rounded-sm border border-zinc-200">
                  <p>{card.number}</p>
                  <p>{card.expiry}</p>
                </Card>
                <Button className="w-full" onClick={changePaymentOnOpenChange}>
                  Alterar forma de pagamento
                </Button>
              </div>
            )}
          </div>
        </Card>

        <AlertDialog open={turnFreeIsOpen} onOpenChange={turnFreeOnOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza disso ?</AlertDialogTitle>
              <AlertDialogDescription>
                Isso vai tornar o seu plano gratuito, que tem funcionalidades
                limitadas
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleCancelUserSubscription}
              >
                Confirmar Cancelamento
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={changePlanIsOpen} onOpenChange={changePlanOnOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar plano</DialogTitle>
            </DialogHeader>
            <div className="px-2 max-w-2xl">
              <label
                htmlFor="planId"
                className="flex mb-2 pt-4 text-sm font-medium text-gray-900"
              >
                Escolha um plano
              </label>
              <select
                id="planId"
                value={planSelectedId ?? ""}
                defaultValue=""
                onChange={(event) =>
                  handleChangeSubscription(event.target.value)
                }
                className="bg-gray-50 border cursor-pointer border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option className="cursor-pointer" value="">
                  Selecione uma opção
                </option>
                {plans.map((option) => {
                  return (
                    <option
                      className="cursor-pointer"
                      key={option.id}
                      value={option.id}
                    >
                      {option.name} -{" "}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(option.value / 100)}{" "}
                      a cada {option.durationInMonths}
                    </option>
                  );
                })}
              </select>

              <Button className="mt-2" onClick={handleAssignPlanToUser}>
                Associar plano
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={changePaymentIsOpen}
          onOpenChange={changePaymentOnOpenChange}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar forma de pagamento</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <SaveCardForm userId={params.userId} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Elements>
  );
}
