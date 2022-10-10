import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      firstName: string;
      lastName: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    firstName: string;
    lastName: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
  }
}
