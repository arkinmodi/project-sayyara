import styles from "@styles/components/chat/NoChat.module.css";

const NoChat = () => {
  return (
    <div className={styles.noChatContainer}>
      <div className={styles.noChatContent}>
        <h2>No Chat Selected</h2>
        <p className={styles.p}>
          Select a chat from the left list or create a new conversation through
          requesting a quote from a shop.
        </p>
      </div>
    </div>
  );
};

export default NoChat;
