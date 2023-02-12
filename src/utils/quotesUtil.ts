import { ChatMessage } from "@prisma/client";
import { IMessage } from "src/types/quotes";

export function getMessageListByQuoteId(id: string): Promise<IMessage[] | []> {
  return fetch(`/api/quotes/${id}/chat/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data: ChatMessage[]) => {
        const messageList: IMessage[] = [];
        data.forEach((chat) => {
          messageList.push({
            id: chat.id,
            quoteId: chat.quote_id,
            customerId: chat.customer_id,
            shopId: chat.shop_id,
            message: chat.message,
            createdAt: chat.create_time,
          });
        });
        return messageList;
      });
    } else {
      return [];
    }
  });
}
