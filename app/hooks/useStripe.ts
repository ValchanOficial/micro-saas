import { type Stripe, loadStripe } from '@stripe/stripe-js';

import { useEffect, useState } from 'react';

export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    async function loadStripeAsync() {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUB_KEY) {
        throw new Error(
          'NEXT_PUBLIC_STRIPE_PUB_KEY is not defined in the environment variables'
        );
      }

      const stripeInstance = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUB_KEY
      );

      setStripe(stripeInstance);
    }

    loadStripeAsync();
  }, []);

  async function createPaymentStripeCheckout(checkoutData: {
    testeId: string;
  }) {
    if (!stripe) return;

    try {
      const response = await fetch('/api/stripe/create-pay-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error(error);
    }
  }

  async function createSubscriptionStripeCheckout(checkoutData: {
    testeId: string;
  }) {
    if (!stripe) return;

    try {
      const response = await fetch('/api/stripe/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      const data = await response.json();
      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateStripePortal() {
    const response = await fetch('/api/stripe/create-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    window.location.href = data.url;
  }

  return {
    createPaymentStripeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal,
  };
}
