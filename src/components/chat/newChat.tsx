import styles from "@styles/components/chat/NewChat.module.css";

/**
 * Displays on a new chat that has no chat messages
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 02/13/2023
 * @returns A react component for a new chat
 */
const NewChat = () => {
  return (
    <div className={styles.newChatContainer}>
      <div className={styles.newChatContent}>
        <h2>New Conversation</h2>
        <p>Start a new conversation by typing a message.</p>
      </div>
    </div>
  );
};

export default NewChat;
