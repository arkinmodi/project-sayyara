import styles from "@styles/components/quotes/Dashboard.module.css";
import ChatForm from "../chat/chatForm";
import ChatTitle from "../chat/chatTitle";
import NoChat from "../chat/noChat";
import Conversations from "./conversations";

const QuotesShell = () => {
  let chatContent = (
    <>
      <NoChat></NoChat>
    </>
  );

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
          <ChatForm />
        </div>
      </div>
    </div>
  );
};

export default QuotesShell;
