import { IQuotesState } from "src/types/quotes";

export const initialQuoteState: IQuotesState = {
  activeChat: null,
  quotes: {
    "0": {
      id: "0",
      shopName: "Shop Name 1",
      serviceName: "Tire Change",
      address: "123 Address St.",
      createdAt: new Date("2023-01-01T00:00:00"),
      messageList: [],
    },
    "1": {
      id: "1",
      shopName: "Shop Name 2",
      serviceName: "Custom Service",
      address: "123 Address St.",
      createdAt: new Date("2023-01-12T00:00:00"),
      messageList: [
        {
          message: "Hello there.",
          createdAt: new Date("2023-01-12T12:00:00"),
          isMyMessage: true,
        },
      ],
    },
    "2": {
      id: "2",
      shopName: "Shop Name 3",
      serviceName: "Custom Service",
      address: "123 Address St.",
      createdAt: new Date("2023-01-05T11:20:00"),
      messageList: [
        {
          message: "This is a test reply message.",
          createdAt: new Date("2023-01-07T14:23:15"),
          isMyMessage: true,
        },
        {
          message: "This is a test message.",
          createdAt: new Date("2023-01-07T14:23:12"),
          isMyMessage: true,
        },
      ],
    },
    "3": {
      id: "3",
      shopName: "Shop Name 4",
      serviceName: "Custom Service",
      address: "123 Address St.",
      createdAt: new Date("2022-12-12T23:59:59"),
      messageList: [
        {
          message: "This is a test message.",
          createdAt: new Date("2023-01-03T06:13:15"),
          isMyMessage: true,
        },
        {
          message: "This is a test message.",
          createdAt: new Date("2023-01-02T17:26:10"),
          isMyMessage: true,
        },
        {
          message: "Lorem Ipsum",
          createdAt: new Date("2023-01-01T14:23:12"),
          isMyMessage: true,
        },
      ],
    },
  },
};
