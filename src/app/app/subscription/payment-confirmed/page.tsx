"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentConfirmed from "./confirmed";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

interface PaymentPageProps {
  searchParams: {
    customerId: string;
    planId: string;
  };
}

export default function PaymentPage({ searchParams }: PaymentPageProps) {
  const { customerId, planId } = searchParams;

  return (
    <Elements stripe={stripePromise}>
      <PaymentConfirmed customerId={customerId} planId={planId} />
    </Elements>
  );
}
