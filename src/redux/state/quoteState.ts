import { IQuotesState } from "src/types/quotes";

export const initialQuoteState: IQuotesState = {
  activeChat: null,
  quotes: {
    "0": {
      id: "0",
      shopName: "Shop Name 1",
      serviceName: "Tire Change",
      address: "123 Address St.",
      createdAt: "2023-01-01T00:00:00",
      messageList: [],
    },
    "1": {
      id: "1",
      shopName: "Shop Name 2",
      serviceName: "Custom Service",
      address: "123 Address St.",
      createdAt: "2023-01-12T00:00:00",
      messageList: [
        {
          id: "0",
          message: "Hello there.",
          createdAt: "2023-01-12T12:00:00",
          isMyMessage: true,
        },
      ],
    },
    "2": {
      id: "2",
      shopName: "Shop Name 3",
      serviceName: "Custom Service",
      address: "123 Address St.",
      createdAt: "2023-01-05T11:20:00",
      messageList: [
        {
          id: "1",
          message: "This is a test reply message.",
          createdAt: "2023-01-07T14:23:15",
          isMyMessage: false,
        },
        {
          id: "0",
          message: "This is a test message.",
          createdAt: "2023-01-05T14:23:12",
          isMyMessage: true,
        },
      ],
    },
    "3": {
      id: "3",
      shopName: "Shop Name 4",
      serviceName: "Custom Service",
      address: "123 Address St.",
      createdAt: "2022-12-12T23:59:59",
      messageList: [
        {
          id: "6",
          message:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",

          createdAt: "2023-01-09T14:23:12",
          isMyMessage: true,
        },
        {
          id: "5",
          message: "This is a test message.",
          createdAt: "2023-01-06T06:13:15",
          isMyMessage: true,
        },
        {
          id: "4",
          message: "This is a test message.",
          createdAt: "2023-01-05T17:26:10",
          isMyMessage: true,
        },
        {
          id: "3",
          message: "Lorem Ipsum",
          createdAt: "2023-01-05T14:23:12",
          isMyMessage: true,
        },
        {
          id: "2",
          message: "This is a test message.",
          createdAt: "2023-01-03T06:13:15",
          isMyMessage: true,
        },
        {
          id: "1",
          message: "This is a test message.",
          createdAt: "2023-01-02T17:26:10",
          isMyMessage: true,
        },
        {
          id: "0",
          message: "Lorem Ipsum",
          createdAt: "2023-01-01T14:23:12",
          isMyMessage: true,
        },
      ],
    },
  },
};
