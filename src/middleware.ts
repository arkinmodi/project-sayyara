export { default } from "next-auth/middleware";

// Routes that need to be protected must be added to this matcher
export const config = { matcher: ["/"] };
