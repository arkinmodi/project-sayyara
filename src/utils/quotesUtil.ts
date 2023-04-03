import { ChatMessage } from "@prisma/client";
import { IMessage } from "src/types/quotes";

/**
 * Get list of messages from a Quote
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 02/13/2023
 * @param {string} id - Id of a Quote
 * @returns A list of Messages
 */

export async function getMessageListByQuoteId(
  id: string
): Promise<IMessage[] | []> {
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
            quoteId: chat.quoteId,
            customerId: chat.customerId,
            shopId: chat.shopId,
            message: chat.message,
            createdAt: chat.createTime,
          });
        });
        return messageList;
      });
    } else {
      return [];
    }
  });
}
