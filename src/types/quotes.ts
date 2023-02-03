export interface IQuoteList {
  [id: string]: IQuote;
}

export interface IQuotesState {
  activeChat: string | null;
  quotes: IQuoteList;
}

export interface IMessage {
  id: string;
  message: string;
  createdAt: string;
  isMyMessage: boolean;
}

export interface IQuote {
  id: string;
  shopName: string;
  serviceName: string;
  address: string;
  createdAt: string;
  messageList: IMessage[];
}
