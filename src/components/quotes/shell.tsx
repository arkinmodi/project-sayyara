import styles from "@styles/components/quotes/Dashboard.module.css";
import img from "public/icons/icon-192x192.png";
import ChatForm from "../chat/chatForm";
import ChatTitle from "../chat/chatTitle";
import NoChat from "../chat/noChat";
import Conversations from "./conversations";

const QuotesShell = ({ chats, chatChanged, onMessageSubmit, loadChat }) => {
  const temp = [
    {
      name: "Shop Name 1",
      address: "123 Address St.",
      lastUpdated: "XX/XX/XX XX:XX PM",
    },
    {
      name: "Shop Name 2",
      address: "123 Address St.",
      lastUpdated: "XX/XX/XX XX:XX PM",
    },
    {
      name: "Shop Name 3",
      address: "123 Address St.",
      lastUpdated: "XX/XX/XX XX:XX PM",
    },
    {
      name: "Shop Name 4",
      address: "123 Address St.",
      lastUpdated: "XX/XX/XX XX:XX PM",
    },
    {
      name: "Shop Name 1",
      address: "123 Address St.",
      lastUpdated: "XX/XX/XX XX:XX PM",
    },
    {
      name: "Shop Name 2",
      address: "123 Address St.",
      lastUpdated: "XX/XX/XX XX:XX PM",
    },
    {
      name: "Shop Name 3",
      address: "123 Address St.",
      lastUpdated: "XX/XX/XX XX:XX PM",
    },
    {
      name: "Shop Name 4",
      address: "123 Address St.",
      lastUpdated: "XX/XX/XX XX:XX PM",
    },
  ];

  let chatContent = (
    <>
      <NoChat></NoChat>
    </>
  );

  let selectedChat = {
    name: "Shop Name 1",
    image: img,
  };

  return (
    <div>
      <h2 className={styles.h2}>Conversations</h2>
      <hr className={styles.hr} />
      <div className={styles.container}>
        <div className={styles.conversationList}>
          <Conversations />
        </div>
        <div className={styles.chat}>
          <ChatTitle selectedChat={selectedChat} />
          {chatContent}
          <ChatForm
            selectedChat={selectedChat}
            onMessageSubmit={onMessageSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default QuotesShell;
