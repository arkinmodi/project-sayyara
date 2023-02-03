import QuoteTypes from "../types/quoteTypes";

interface IQuoteActionBase {
  type: QuoteTypes;
}

export interface IQuoteActionSetSelectedChat extends IQuoteActionBase {
  payload: { id: string };
}

export type IQuoteAction = IQuoteActionSetSelectedChat;

export const setSelectedChat = (
  payload: IQuoteActionSetSelectedChat["payload"]
) => ({
  type: QuoteTypes.SET_SELECTED_CHAT,
  payload,
});
