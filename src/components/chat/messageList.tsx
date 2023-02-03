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

  let messageItems = (
    <>
      <NewChat></NewChat>
    </>
  );

  if (messages!.length > 0) {
    messages!.sort(
      (a: IMessage, b: IMessage) =>
        b.createdAt.valueOf() - a.createdAt.valueOf()
    );
    messageItems = messages!.map((msg: IMessage) => {
      return <Message msg={msg} />;
    });
  }

  return <div className={styles.messageList}>{messageItems}</div>;
};

export default MessageList;
