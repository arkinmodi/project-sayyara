import styles from "@styles/components/quotes/Dashboard.module.css";
import { useSelector } from "react-redux";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";
import ChatForm from "../chat/chatForm";
import ChatTitle from "../chat/chatTitle";
import MessageList from "../chat/messageList";
import NoChat from "../chat/noChat";
import Conversations from "./conversations";

const QuotesShell = () => {
  const selectedChat = useSelector(QuoteSelectors.getActiveChat);
  let chatContent = (
    <>
      <NoChat></NoChat>
    </>
  );

  if (selectedChat) {
    chatContent = (
      <>
        <MessageList />
      </>
    );
  }

  return (
    <div>
      <h2 className={styles.h2}>Conversations</h2>
      <hr className={styles.hr} />
      <div className={styles.container}>
        <div className={styles.conversationList}>
          <Conversations />
        </div>
        <div className={styles.chat}>
          <ChatTitle />
          {chatContent}
          <div className={styles.chatForm}>
            <ChatForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotesShell;
