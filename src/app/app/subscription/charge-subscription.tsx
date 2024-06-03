"use client";

import { Subscription } from "./page";

import Cards, { Focused } from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import { useEffect, useState } from "react";

import { X } from "lucide-react";
import { SaveCardForm } from "./forms/save-card-form";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
}

interface Card {
  lastNumbers: string;
  expYear: number;
  expMonth: number;
}

interface Payment {
  id: string;
  completed: boolean;
  value: number;
  voucher: string;
}

export function ChargeSubscription({ subscription }: ChargeSubscriptionProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [openChangePayment, setOpenChangePayment] = useState(false);
  const [planSelectedId, setPlanSelectedId] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  const {
    isOpen: alertIsOpen,
    onClose: alertOnClose,
    onOpenChange: alertOnOpenChange,
  } = useModal();
  const {
    isOpen: changePaymentMethodIsOpen,
    onClose: changePaymentMethodOnClose,
    onOpenChange: changePaymentMethodOnOpenChange,
  } = useModal();
  const {
    isOpen: changePlanIsOpen,
    onClose: changePlanOnClose,
    onOpenChange: changePlanOnOpenChange,
  } = useModal();
  // const {isOpen: alertIsOpen, onClose: alertOnClose, onOpenChange: alertOnOpenChange} =  useModal()

  const [card, setCard] = useState({
    number: "",
    expiry: "",
    name: "",
    cvc: "",
  });

  async function handleCancelUserSubscription() {
    const response = await fetchApi(
      `/subscription/cancel/${subscription.user.id}`, // id do usuário
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
    window.location.reload();
  }

  async function getPlans() {
    const response = await fetchApi(`/plans/fetch/available-to-upgrade`);

    if (!response.ok) {
      toast.error("Não foi possivel buscar os planos para esse usuário");
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
      toast.error(respError.error);
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
      toast.error("Erro ao associar plano");
      return;
    }

    toast.success("Plano associado com sucesso");
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
      <p className="text-3xl mb-4">Plano atual</p>
      <div className="w-full grid grid-cols-2 items-center gap-2">
        <Card className="flex flex-col gap-4 h-72 p-4">
          <div className="w-full h-full flex items-center justify-between">
            <div className="h-full flex flex-col gap-2 justify-between">
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
                    `/ Cobrado a cada ${subscription.plan.durationInMonths} mês`}
                </p>

                <Badge className="bg-slate-900 w-fit">{subscription.active ? "ativa" : "inativa"}</Badge>
              </div>

              <div className="flex items-center justify-start gap-2 mt-auto">
                <Button onClick={changePlanOnOpenChange}>Alterar plano</Button>

                <Button
                  onClick={alertOnOpenChange}
                  className="bg-red-400 hover:bg-red-500 text-white"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="w-full h-72 flex items-center justify-center p-4">
          <div className="w-80 flex flex-col items-center justify-start gap-2">
            <Cards
              number={card.number}
              expiry={card.expiry}
              cvc={card.cvc}
              name={card.name}
              preview
            />
            <Button
              className="w-full"
              onClick={changePaymentMethodOnOpenChange}
            >
              Alterar forma de pagamento
            </Button>
          </div>
        </Card>
      </div>

      {hasPayments && (
        <Card className="p-4">
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

      <AlertDialog open={alertIsOpen} onOpenChange={alertOnOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza disso ?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso irá cancelar a assinatura do usuário
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
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <div className="px-2 max-w-2xl">
            <label
              htmlFor="workspace"
              className="flex mb-2 pt-4 text-sm font-medium text-gray-900"
            >
              Escolha um plano
            </label>
            <select
              id="planId"
              value={planSelectedId ?? ""}
              defaultValue=""
              onChange={(event) => handleChangeSubscription(event.target.value)}
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
        open={changePaymentMethodIsOpen}
        onOpenChange={changePaymentMethodOnOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar forma de pagamento</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4">
            <SaveCardForm userId={subscription.user.id} />
          </div>
        </DialogContent>
      </Dialog>
    </Elements>
  );
}
