import { IMessage } from "src/types/quotes";
import QuoteTypes from "../types/quoteTypes";

interface IQuoteActionBase {
  type: QuoteTypes;
}

export interface IQuoteActionSetSelectedChat extends IQuoteActionBase {
  payload: { id: string };
}

export interface IQuoteActionCreateMessage extends IQuoteActionBase {
  payload: { quoteId: string; message: string };
}

export interface IQuoteActionSetMessage extends IQuoteActionBase {
  payload: { quoteId: string; message: IMessage };
}

export type IQuoteAction =
  | IQuoteActionSetSelectedChat
  | IQuoteActionSetMessage
  | IQuoteActionCreateMessage;

export const setSelectedChat = (
  payload: IQuoteActionSetSelectedChat["payload"]
) => ({
  type: QuoteTypes.SET_SELECTED_CHAT,
  payload,
});

export const createMessage = (
  payload: IQuoteActionCreateMessage["payload"]
) => ({
  type: QuoteTypes.CREATE_MESSAGE,
  payload,
});

export const setMessage = (payload: IQuoteActionSetMessage["payload"]) => ({
  type: QuoteTypes.SET_MESSAGE,
  payload,
});
