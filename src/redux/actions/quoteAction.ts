import { IMessage, IQuote, IQuoteList } from "src/types/quotes";
import QuoteTypes from "../types/quoteTypes";

interface IQuoteActionBase {
  type: QuoteTypes;
}

export interface IQuoteActionGetCustomerQuotes extends IQuoteActionBase {
  payload: void;
}

export interface IQuoteActionGetShopQuotes extends IQuoteActionBase {
  payload: void;
}

export interface IQuoteActionUpdateInitialState extends IQuoteActionBase {
  payload: { quotesList: IQuote };
}

export interface IQuoteActionCreateQuote extends IQuoteActionBase {
  payload: { customerId: string; shopId: string; serviceId: string };
}

export interface IQuoteActionAddQuoteToState extends IQuoteActionBase {
  payload: { data: IQuoteList };
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
  | IQuoteActionGetCustomerQuotes
  | IQuoteActionGetShopQuotes
  | IQuoteActionUpdateInitialState
  | IQuoteActionCreateQuote
  | IQuoteActionAddQuoteToState
  | IQuoteActionSetSelectedChat
  | IQuoteActionSetMessage
  | IQuoteActionCreateMessage;

export const getCustomerQuotes = (
  payload: IQuoteActionGetCustomerQuotes["payload"]
) => ({
  type: QuoteTypes.GET_CUSTOMER_QUOTES,
  payload,
});

export const getShopQuotes = (
  payload: IQuoteActionGetShopQuotes["payload"]
) => ({
  type: QuoteTypes.GET_SHOP_QUOTES,
  payload,
});

export const updateInitialState = (
  payload: IQuoteActionUpdateInitialState["payload"]
) => ({
  type: QuoteTypes.UPDATE_INITIAL_STATE,
  payload,
});

export const createQuote = (payload: IQuoteActionCreateQuote["payload"]) => ({
  type: QuoteTypes.CREATE_QUOTE,
  payload,
});

export const addQuoteToState = (
  payload: IQuoteActionAddQuoteToState["payload"]
) => ({
  type: QuoteTypes.ADD_QUOTE_TO_STATE,
  payload,
});

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
