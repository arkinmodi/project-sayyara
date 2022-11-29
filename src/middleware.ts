export { default } from "next-auth/middleware";

// Routes that need to be protected must be added to this matcher
// https://next-auth.js.org/tutorials/securing-pages-and-api-routes#nextjs-middleware
export const config = { matcher: ["/", "/appointments/:path*"] };
