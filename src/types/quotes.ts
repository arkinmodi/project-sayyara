export interface IQuoteList {
  [id: string]: IQuote;
}

export interface IQuotesState {
  activeChat: string | null;
  quotes: IQuoteList;
}

export interface IQuote {
  id: string;
  name: string;
  address: string;
  lastUpdated: Date;
}
