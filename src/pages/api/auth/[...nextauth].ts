import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        username: {
          label: "Email",
          type: "email",
          placeholder: "example@sayyara.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        // todo: call backend to verify credentials in db
        // console.log("running authorize()");
        // console.log("credentials?", credentials);

        return {
          id: 1,
          firstName: "John",
          lastName: "Smith",
          email: credentials.username ?? "johnsmith@example.com",
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
};

export default NextAuth(authOptions);
