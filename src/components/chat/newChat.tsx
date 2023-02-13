import styles from "@styles/components/chat/NewChat.module.css";

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
