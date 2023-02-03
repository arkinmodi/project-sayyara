import styles from "@styles/components/chat/Message.module.css";

const Message = (props) => {
  let msgClass = styles.other;
  if (props.isMyMessage) {
    msgClass = styles.you;
  }

  return (
    <div className={msgClass}>
      <div className={styles.messageContent}>
        <div className={styles.messageText}>{props.message.messageText}</div>
        <div className={styles.messageTime}>
          {props.message.createdAt.toLocaleString("en-US")}
        </div>
      </div>
    </div>
  );
};

export default Message;
