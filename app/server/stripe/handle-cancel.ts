import 'server-only';

import { db } from '@/app/lib/firebase';
import resend from '@/app/lib/resend';
import type Stripe from 'stripe';

export async function handleStripeCancelSubscription(
  event: Stripe.CustomerSubscriptionDeletedEvent
) {
  console.log('Cancelou a assinatura');

  const customerId = event.data.object.customer;

  const userRef = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .get();

  if (!userRef) {
    console.error('User not found');

    return;
  }

  const userId = userRef.docs[0].id;
  const userEmail = userRef.docs[0].data().email;

  await db.collection('users').doc(userId).update({
    subscriptionStatus: 'inactive',
  });

  const { data, error } = await resend.emails.send({
    from: 'Acme <me@example.com>',
    to: [userEmail],
    subject: 'Assinatura cancelada com sucesso',
    text: 'Assinatura cancelada com sucesso',
  });

  if (error) {
    console.error(error);
  }

  console.log(data);
}
