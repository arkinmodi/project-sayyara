import styles from "@styles/components/chat/Message.module.css";
import Message from "./message";

const MessageList = () => {
  const temp = [
    {
      messageText: "Hello World",
      createdAt: new Date(),
      isMyMessage: false,
    },
    {
      messageText: "This is a longer message.",
      createdAt: new Date(),
      isMyMessage: true,
    },
    {
      messageText: "Hello World",
      createdAt: new Date(),
      isMyMessage: false,
    },
    {
      messageText: "This is a longer message.",
      createdAt: new Date(),
      isMyMessage: true,
    },
    {
      messageText: "Hello World",
      createdAt: new Date(),
      isMyMessage: false,
    },
    {
      messageText: "Testing this one as well.",
      createdAt: new Date(),
      isMyMessage: false,
    },
    {
      messageText: "This is a longer message.",
      createdAt: new Date(),
      isMyMessage: true,
    },
    {
      messageText: "Hello World",
      createdAt: new Date(),
      isMyMessage: false,
    },
    {
      messageText: "Testing this one as well.",
      createdAt: new Date(),
      isMyMessage: false,
    },
  ];
  let messageItems = null;

  messageItems = temp.map((message) => {
    return <Message isMyMessage={message.isMyMessage} message={message} />;
  });
  return <div className={styles.messageList}>{messageItems}</div>;
};

export default MessageList;
