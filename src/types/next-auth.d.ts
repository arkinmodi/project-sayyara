import { UserType } from "@server/db/client";
import { DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      type: UserType;
      shopId?: string | null;
      image?: string | null;
    };
  }

  interface User extends DefaultUser {
    firstName: string;
    lastName: string;
    type: UserType;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    type: UserType;
    shopId?: string;
  }
}
