"use client";

import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSubscription } from "@/contexts/subscription-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";

interface CheckoutFormProps {
  customerId: string;
  planId?: string | null;
}

export function CheckoutForm({ customerId, planId = null }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();

  const { removeCookie } = useSubscription();

  const [message, setMessage] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          fetchApi(`/subscription/activate-subscription/${customerId}`, {
            method: "POST",
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              planId: planId ?? null,
            }),
          }).then((res) => {
            if (!res.ok) {
              toast.error("Não foi possivel ativar a sua inscrição",{
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
              });
              return;
            }

            toast.success("Inscrição ativada com sucesso",{
              action: {
                label: "Undo",
                onClick: () => console.log("Undo"),
              },
            });
            // window.location.href = '/manage-plan'
            router.replace("/app/subscription");
          });

          removeCookie();

          setMessage("Pagamento confirmado!");
          break;
        case "processing":
          setMessage("Seu pagamento está sendo processado.");
          break;
        case "requires_payment_method":
          setMessage("Erro no pagamento, porfavor tente novamente.");
          break;
        default:
          setMessage("Aconteceu algum erro.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/subscription/payment${
          planId ? `?planId=${planId}` : ""
        }`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("Um erro inesperado ocorreu.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: any = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="bg-violet-500 text-white px-4 py-2 rounded-md float-right"
      >
        <span id="button-text">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          ) : (
            "Pagar agora"
          )}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
