import { render, screen } from "@testing-library/react";
import Home from "../src/pages/index";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";

describe("Home", () => {
  it("renders a heading", () => {
    render(
      <SessionProvider
        session={{
          expires: "1",
          user: {
            id: "test-id-1",
            firstName: "FirstName",
            lastName: "LastName",
            email: "test@sayyara.com",
          },
        }}
      >
        <Home />
      </SessionProvider>
    );

    const heading = screen.getByRole("heading", {
      name: /welcome to next\.js!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
