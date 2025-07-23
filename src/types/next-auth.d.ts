// src/types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser, JWT as DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's id. */
      id: string;
    } & DefaultSession["user"];
  }

  // If you ever reference `token.id`:
  interface JWT extends DefaultJWT {
    id: string;
  }
}
