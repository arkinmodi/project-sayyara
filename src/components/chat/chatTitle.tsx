import styles from "@styles/components/chat/ChatTitle.module.css";
import Image, { StaticImageData } from "next/image";

// TODO Interface for quote conversations
const ChatTitle = ({ selectedChat }) => {
  let chatTitleContents = null;

  if (selectedChat) {
    let img: StaticImageData = selectedChat.image;
    let name: string = selectedChat.name;
    chatTitleContents = (
      <>
        {/* Conversation image */}
        <Image
          src={img}
          alt={name}
          // TODO Figure out height/width ratios
          height={img.height * 0.25}
          width={img.width * 0.3}
        />
        {/* Conversation name */}
        <span className={styles.span}>{name}</span>
      </>
    );
  }

  return <div className={styles.chatTitle}>{chatTitleContents}</div>;
};

export default ChatTitle;
