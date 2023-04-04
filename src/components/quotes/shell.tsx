import styles from "@styles/components/quotes/Dashboard.module.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";
import ChatForm from "../chat/chatForm";
import ChatTitle from "../chat/chatTitle";
import MessageList from "../chat/messageList";
import NoChat from "../chat/noChat";
import Conversations from "./conversations";

/**
 * Renders the shell of the quotes window
 * Creates the layout for the other components within the quotes page
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 02/13/2023
 * @returns A react component containing the shell of the quotes window
 */
const QuotesShell = () => {
  const [page, setPage] = useState(0);
  const selectedChat = useSelector(QuoteSelectors.getActiveChat);

  // For mobile: Sets the page to show chat content
  const nextPage = () => {
    setPage(1);
  };

  // For mobile: Sets the page to display list of chats
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

  /**
   * Renders mobile view based on current page number
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/13/2023
   * @param {number} page - Page number
   * @returns A react component displaying the shell of the quotes view
   */
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
