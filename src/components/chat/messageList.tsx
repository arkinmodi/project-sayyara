import styles from "@styles/components/chat/Message.module.css";
import { useSelector } from "react-redux";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";
import { IMessage } from "src/types/quotes";
import Message from "./message";
import NewChat from "./newChat";

const MessageList = () => {
  const selectedChatId = useSelector(QuoteSelectors.getActiveChat);
  const messages = useSelector(QuoteSelectors.getQuotes)[selectedChatId!]
    ?.messageList;

  const getMessageItems = () => {
    if (messages && messages.length > 0) {
      let messageItems: any = [];
      messages.sort((a: IMessage, b: IMessage) =>
        b.createdAt >= a.createdAt ? 0 : -1
      );
      messages.forEach((msg: IMessage) => {
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
