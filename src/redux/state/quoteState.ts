import { IQuotesState } from "src/types/quotes";

export const initialQuoteState: IQuotesState = {
  activeChat: null,
  quotes: {
    "0": {
      id: "0",
      name: "Shop Name 1",
      address: "123 Address St.",
      lastUpdated: new Date("2023-01-01T00:00:00"),
    },
    "1": {
      id: "1",
      name: "Shop Name 2",
      address: "123 Address St.",
      lastUpdated: new Date("2023-01-12T00:00:00"),
    },
    "2": {
      id: "2",
      name: "Shop Name 3",
      address: "123 Address St.",
      lastUpdated: new Date("2023-01-05T11:20:00"),
    },
    "3": {
      id: "3",
      name: "Shop Name 4",
      address: "123 Address St.",
      lastUpdated: new Date("2022-12-12T23:59:59"),
    },
  },
};
