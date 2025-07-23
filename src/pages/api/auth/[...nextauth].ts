// src/pages/api/auth/[...nextauth].ts

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/user/${credentials?.email}`
          );
          if (!res.ok) {
            console.error('User fetch failed:', res.status, await res.text());
            return null;
          }
          const user = await res.json();
          if (!user) {
            console.error('No user found for email:', credentials?.email);
            return null;
          }
          const passwordMatch = await compare(credentials!.password, user.password);
          if (!passwordMatch) {
            console.error('Password mismatch for user:', credentials?.email);
            return null;
          }
          return { id: String(user._id), name: user.name, email: user.email };
        } catch (err) {
          console.error('Authorize error:', err);
          return null;
        }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) token.id = (user as any).id;
      if (account?.provider === 'google' && profile) {
        token.name = profile.name;
        token.email = profile.email;
        token.picture = (profile as any).picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user = { ...session.user, id: String(token.id) };
      if (token.name) session.user.name = token.name as string;
      if (token.email) session.user.email = token.email as string;
      if (token.picture) session.user.image = token.picture as string;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});
