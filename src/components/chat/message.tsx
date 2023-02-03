import styles from "@styles/components/chat/Message.module.css";
import React from "react";
import { IMessage } from "src/types/quotes";

interface IMessageProps {
  msg: IMessage;
}

const Message = (props: IMessageProps) => {
  const { msg } = props;
  let msgClass = styles.other;
  if (msg.isMyMessage) {
    msgClass = styles.you;
  }

  return (
    <div className={msgClass}>
      <div className={styles.messageContent}>
        <div className={styles.messageText}>{msg.message}</div>
        <div className={styles.messageTime}>
          {msg.createdAt.toLocaleString("en-US")}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Message);
