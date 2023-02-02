import { IQuote } from "src/types/quotes";
export interface IQuotesState {
  activeChat: string | null;
  quotes: IQuote[];
}

export const initialQuoteState: IQuotesState = {
  activeChat: null,
  quotes: [
    {
      id: "0",
      name: "Shop Name 1",
      address: "123 Address St.",
      lastUpdated: new Date("2023-01-01T00:00:00"),
    },
  ],
};
