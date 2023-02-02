import { IQuote } from "src/types/quotes";

export interface IQuotesState {
  activeChat: string | null;
  quotes: Map<string, IQuote>;
}

const quoteMap = new Map<string, IQuote>([
  [
    "0",
    {
      id: "0",
      name: "Shop Name 1",
      address: "123 Address St.",
      lastUpdated: new Date("2023-01-15T13:25:00"),
    },
  ],
]);

export const initialQuoteState: IQuotesState = {
  activeChat: null,
  quotes: quoteMap,
};
