import styles from "@styles/components/chat/ChatTitle.module.css";
import Image from "next/image";
import img from "public/icons/icon-192x192.png";
import { useSelector } from "react-redux";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";
import { IQuote, IQuoteList } from "src/types/quotes";

// TODO Interface for quote conversations
const ChatTitle = () => {
  let chatTitleContents = null;

  const selectedChatId = useSelector(QuoteSelectors.getActiveChat);
  const quotes: IQuoteList = useSelector(QuoteSelectors.getQuotes);

  if (selectedChatId !== null) {
    const selectedChat: IQuote = quotes[selectedChatId];
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
