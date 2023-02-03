export interface IQuoteList {
  [id: string]: IQuote;
}

export interface IQuotesState {
  activeChat: string | null;
  quotes: IQuoteList;
}

export interface IMessage {
  message: string;
  createdAt: Date;
  isMyMessage: boolean;
}

export interface IQuote {
  id: string;
  shopName: string;
  serviceName: string;
  address: string;
  createdAt: Date;
  messageList: IMessage[];
}
