import { Subscription } from "../subscription";

interface PaymentPageParams {
  searchParams: {
    planId?: string;
  };
}

export default function PaymentPage({ searchParams }: PaymentPageParams) {
  return (
    <div className="w-full h-full p-8 flex items-start justify-center">
      <div className="w-[600px]">
        <Subscription planId={searchParams.planId ?? null} />
      </div>
    </div>
  );
}
