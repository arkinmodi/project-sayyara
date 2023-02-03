import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authorize } from "@server/services/userService";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@sayyara.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        if (!credentials) return null;
        return await authorize(credentials.email, credentials.password).catch(
          (_reason) => null
        );
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.type = token.type;

        if (token.type !== "CUSTOMER" && token.shopId) {
          session.user.shopId = token.shopId;
        }
      }
      return session;
    },
  },
  theme: {
    logo: "/icons/icon-512x512.png",
  },
  pages: {
    signIn: "/",
  },
};

export default NextAuth(authOptions);
