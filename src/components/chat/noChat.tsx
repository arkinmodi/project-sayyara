import styles from "@styles/components/chat/NoChat.module.css";

/**
 * Displays when no chat is selected
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 02/13/2023
 * @returns A react component
 */
const NoChat = () => {
  return (
    <div className={styles.noChatContainer}>
      <div className={styles.noChatContent}>
        <h2>No Chat Selected</h2>
        <p>
          Select a chat from the left list or create a new conversation through
          requesting a quote from a shop.
        </p>
      </div>
    </div>
  );
};

export default NoChat;
