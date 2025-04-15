import { firebaseCert } from '@/app/lib/firebase';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: FirestoreAdapter({
    credential: firebaseCert,
  }),
});
