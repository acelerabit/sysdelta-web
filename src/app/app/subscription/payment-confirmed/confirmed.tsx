"use client";

import { useSubscription } from "@/contexts/subscription-context";
import { fetchApi } from "@/services/fetchApi";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PaymentConfirmed({
  customerId,
  planId,
}: {
  customerId: string;
  planId?: string;
}) {
  const stripe = useStripe();

  const router = useRouter();

  const { removeCookie } = useSubscription();

  const [message, setMessage] = useState("");
  const [animationComplete, setAnimationComplete] = useState(false);

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
          setAnimationComplete(true);

          fetchApi(`/subscription/activate-subscription/${customerId}`, {
            method: "POST",
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              paymentMethod: paymentIntent.payment_method?.toString(),
              planId,
            }),
          }).then((res) => {
            if (!res.ok) {
              toast.error("Não foi possivel ativar a sua inscrição");
              router.replace("/app/dashboard");

              return;
            }

            toast.success("Inscrição ativada com sucesso");
            // window.location.href = '/manage-plan'
            router.replace("/app/subscription");
          });
          // router.replace("/manage-plan");
          removeCookie();

          setMessage("Pagamento confirmado!");
          break;
        case "processing":
          toast.error("Seu pagamento está sendo processado.");

          setMessage("Seu pagamento está sendo processado.");
          router.replace("/app/dashboard");

          break;
        case "requires_payment_method":
          toast.error("Erro no pagamento, porfavor tente novamente.");

          setMessage("Erro no pagamento, porfavor tente novamente.");
          router.replace("/app/dashboard");

          break;
        default:
          setMessage("Aconteceu algum erro.");
          toast.error("Aconteceu algum erro.");
          router.replace("/app/dashboard");

          break;
      }
    });
  }, [stripe]);

  return (
    <div
      className={`fixed z-50 inset-0 flex items-center justify-center transition-all duration-1000 ${
        animationComplete ? "bg-green-500" : "bg-transparent"
      }`}
    >
      <div
        className={`flex flex-col gap-4 items-center justify-center text-center transition-opacity duration-1000 ${
          animationComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        <CheckCircle className="w-24 h-24 text-white animate-customPing duration-3000" />
        <h1 className="mt-12 text-xl text-white animate-customPing duration-3000">
          Pagamento Confirmado!
        </h1>
      </div>
    </div>
  );
}
