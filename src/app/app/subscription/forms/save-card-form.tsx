import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { SubmitHandler, useForm, Controller } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { useState } from "react";
import { StripeCardElement } from "@stripe/stripe-js";
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { fetchApi } from "@/services/fetchApi";
import { Button } from "@/components/ui/button";

type InputsCard = {
  cvc: string;
  exp: number;
  cardNumbers: string;
  name: string;
};

interface SaveCardProps {
  userId: string;
}

export function SaveCardForm({ userId }: SaveCardProps) {
  const stripe = useStripe();
  const elements = useElements();

  const schema = z.object({
    cardNumbers: z
      .string()
      .min(16, "Deve ter no minimo 16 dígitos")
      .max(16, "Deve ter no máximo 16 dígitos"),
    cvc: z.string(),
    exp: z.number(),
    name: z.string(),
  })

  const cardForm = useForm<InputsCard>({
    resolver: zodResolver(schema),
  });

  // const onSubmitCreateCard: SubmitHandler<InputsCard> = async (dataForm) => {
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // We don't want to let default form submission happen here,
    // which would refresh the page.

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log("Stripe.js has not yet loaded.");
      return;
    }
    
    const cardElement = elements.getElement(CardElement);

    // const paymentMethod = await stripe.createToken(cardElement as StripeCardElement)

    const { paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement as StripeCardElement,
      // billing_details: {}
    });

    if (!paymentMethod) {
      toast.error("Não foi possivel cadastrar nova forma de pagamento",{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    }

    const requestData = {
      userId,
      paymentMethodId: paymentMethod?.id,
    };

    const response = await fetchApi(
      `/subscription/change-payment-method/${userId}`,
      {
        method: "PATCH",
        body: JSON.stringify(requestData),
      }
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

    toast.success("Cartão cadastrado com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
    window.location.reload()
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col h-full w-full gap-4">
        <label htmlFor="card">Dados do cartão</label>

        <div className="flex flex-col h-full w-full justify-between">
          <CardElement
            id="card"
            options={{ hidePostalCode: true, disableLink: true }}
            className="p-4 border rounded-md focus:ring-blue-500 border-blue-500"
          />

          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </>
  );
}
