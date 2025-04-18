import 'server-only';

import { db } from '@/app/lib/firebase';
import resend from '@/app/lib/resend';
import type Stripe from 'stripe';

export async function handleStripPayment(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  if (event.data.object.payment_status === 'paid') {
    console.log(
      'Pagamento realizado com sucesso. Enviar um email liberar acesso.'
    );

    const metadata = event.data.object.metadata;
    const userId = metadata?.userId;
    const userEmail =
      event.data.object.customer_email ||
      event.data.object.customer_details?.email;

    if (!userId || !userEmail) {
      console.error('User ID or email not found');
      return;
    }

    await db.collection('users').doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: 'active',
    });

    const { data, error } = await resend.emails.send({
      from: 'Acme <me@example.com>',
      to: [userEmail],
      subject: 'Pagamento realizado com sucesso',
      text: 'Pagamento realizado com sucesso',
    });

    if (error) {
      console.error(error);
    }
    console.log(data);
  }
}
