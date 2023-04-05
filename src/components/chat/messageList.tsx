import styles from "@styles/components/chat/Message.module.css";
import { useSelector } from "react-redux";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";
import { IMessage, IQuote } from "src/types/quotes";
import Message from "./message";
import NewChat from "./newChat";

/**
 * Creates the list of messages for a chat
 * Will show an empty page if chat messages do not exist for the selected chat
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 02/13/2023
 * @returns A react component for a list of chat messages
 */
const MessageList = () => {
  const selectedChatId = useSelector(QuoteSelectors.getActiveChat);
  const quoteList = useSelector(QuoteSelectors.getQuotes);
  let messageList: IMessage[] = [];

  if (selectedChatId) {
    messageList = (quoteList[selectedChatId] as IQuote).messageList;
  }

  const getMessageItems = () => {
    if (messageList && messageList.length > 0) {
      let messageItems: any = [];
      messageList.forEach((msg: IMessage) => {
        messageItems.push(<Message key={msg.id} msg={msg} />);
      });

      return messageItems;
    } else {
      return (
        <>
          <NewChat></NewChat>
        </>
      );
    }
  };

  return <div className={styles.messageList}>{getMessageItems()}</div>;
};

export default MessageList;
