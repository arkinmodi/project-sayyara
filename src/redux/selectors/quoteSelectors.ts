import { createSelector } from "reselect";
import { IQuotesState } from "../state/quotesState";
import { RootState } from "../store";

const getQuotesState = (state: RootState): IQuotesState => state.quotes;

const getActiveChat = createSelector(
  getQuotesState,
  (quotesState) => quotesState.activeChat
);

const getQuotes = createSelector(
  getQuotesState,
  (quoteState) => quoteState.quotes
);

export const QuoteSelectors = {
  getActiveChat,
  getQuotes,
};
