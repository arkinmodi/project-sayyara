import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getUser } from "@server/service/userService";

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

        const userData = await getUser(credentials.email);
        if (!userData || userData.password !== credentials.password) {
          return null;
        }

        return {
          id: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    },
  },
  theme: {
    logo: "/icons/icon-512x512.png",
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
