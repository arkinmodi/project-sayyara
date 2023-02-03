import styles from "@styles/components/quotes/Conversations.module.css";
import Image from "next/image";
import { ListBox, ListBoxChangeParams } from "primereact/listbox";
import image from "public/icons/icon-192x192.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "src/redux/actions/quoteAction";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";
import { IQuote } from "src/types/quotes";

const Conversations = () => {
  const dispatch = useDispatch();

  const selectedChat = useSelector(QuoteSelectors.getActiveChat);

  // Loads quote list from store and sorts by last created
  const quotes = Object.values(useSelector(QuoteSelectors.getQuotes));
  quotes.sort(
    (a: IQuote, b: IQuote) => b.lastUpdated.valueOf() - a.lastUpdated.valueOf()
  );

  // Sets the selected chat via redux
  const setChat = (chatId: string) => {
    dispatch(setSelectedChat({ id: chatId }));
  };

  const chatItem = (option: IQuote) => {
    return (
      <div className={styles.chatItem}>
        <Image
          src={image}
          alt={option.name}
          height={image.height * 0.3}
          width={image.width * 0.3}
        />
        <div className={styles.chatText}>
          <h4 className={styles.h3}>{option.name}</h4>
          {option.address} <br />
          {"Create " + option.lastUpdated.toLocaleString("en-US")}
        </div>
      </div>
    );
  };

  return (
    <div>
      <ListBox
        filter
        className={styles.listBox}
        value={selectedChat}
        options={quotes}
        onChange={(e: ListBoxChangeParams) => setChat(e.value.id)}
        filterBy="name"
        itemTemplate={chatItem}
        listStyle={{ maxHeight: "32.5rem" }}
      />
    </div>
  );
};

export default Conversations;
