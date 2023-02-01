import styles from "@styles/components/chat/Message.module.css";

const Message = () => {
  let message = {
    messageText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    createdAt: "5 hours ago",
  };
  return (
    <div>
      <div className={styles.messageContent}>
        <div className={styles.messageText}>{message.messageText}</div>
        <div className={styles.messageTime}>{message.createdAt}</div>
      </div>
    </div>
  );
};

export default Message;
