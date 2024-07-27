"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

// Carregar a biblioteca Stripe

interface SubscriptionFormProps {
  customerId: string;
  planId: string;
  clientSecret: string;
}

export function SubscriptionForm({
  customerId,
  planId,
  clientSecret,
}: SubscriptionFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/app/subscription/payment-confirmed?customerId=${customerId}&planId=${planId}`,
      },
    });

    if (result.error) {
      setMessage(result.error.message ?? "");
      setLoading(false);
      return;
    }

    setMessage("Subscription successful!");
    setLoading(false);
  };

  return (
    <div className="w-full p-4 flex flex-col items-center justify-center">
      <div className="w-full">
        <p className="text-xl mb-4">Adicione o cartão para pagamento</p>

        <form onSubmit={handleSubmit}>
          {clientSecret && <PaymentElement />}
          <button
            disabled={loading || !stripe || !elements}
            id="submit"
            className="bg-violet-500 text-white px-4 py-2 rounded-md float-right"
          >
            <span id="button-text">
              {loading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                "Pagar agora"
              )}
            </span>
          </button>
          {message && <div>{message}</div>}
        </form>
      </div>
    </div>
  );
}
