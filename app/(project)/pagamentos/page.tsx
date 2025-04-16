"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function Pagamentos() {
	const {
		createPaymentStripeCheckout,
		createSubscriptionStripeCheckout,
		handleCreateStripePortal,
	} = useStripe();

	return (
		<div className="flex flex-col gap-10 items-center justify-center h-screen">
			<h1 className="text-4xl font-bold">Pagamentos</h1>
			<button
				type="button"
				className="border rounded-md px-1 cursor-pointer"
				onClick={() => createPaymentStripeCheckout({ testeId: "123" })}
			>
				Criar Pagamento Stripe
			</button>
			<button
				type="button"
				className="border rounded-md px-1 cursor-pointer"
				onClick={() => createSubscriptionStripeCheckout({ testeId: "123" })}
			>
				Criar Assinatura Stripe
			</button>
			<button
				type="button"
				className="border rounded-md px-1 cursor-pointer"
				onClick={handleCreateStripePortal}
			>
				Criar Portal de Pagamento
			</button>
		</div>
	);
}
