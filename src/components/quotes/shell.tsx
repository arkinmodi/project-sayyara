import styles from "@styles/components/quotes/Dashboard.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";
import ChatForm from "../chat/chatForm";
import ChatTitle from "../chat/chatTitle";
import MessageList from "../chat/messageList";
import NoChat from "../chat/noChat";
import Conversations from "./conversations";

const QuotesShell = () => {
  const [page, setPage] = useState(0);
  const selectedChat = useSelector(QuoteSelectors.getActiveChat);

  const nextPage = () => {
    setPage(1);
  };

  const prevPage = () => {
    setPage(0);
  };

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

  const renderMobile = (page: number) => {
    switch (page) {
      case 0:
        return (
          <div className={styles.conversationList}>
            <Conversations nextPage={nextPage} />
          </div>
        );
      case 1:
        return (
          <div className={styles.chat}>
            <ChatTitle prevPage={prevPage} />
            {chatContent}
            <div className={styles.chatForm}>
              <ChatForm />
            </div>
          </div>
        );
      default:
        return;
    }
  };

  return (
    <div>
      <div className={styles.desktopView}>
        <h2 className={styles.h2}>Conversations</h2>
        <hr className={styles.hr} />
        <div className={styles.container}>
          <div className={styles.conversationList}>
            <Conversations nextPage={nextPage} />
          </div>
          <div className={styles.chat}>
            <ChatTitle prevPage={prevPage} />
            {chatContent}
            <div className={styles.chatForm}>
              <ChatForm />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.mobileView}>
        <h2 className={styles.h2}>Conversations</h2>
        <hr className={styles.hr} />
        {renderMobile(page)}
      </div>
    </div>
  );
};

export default QuotesShell;
