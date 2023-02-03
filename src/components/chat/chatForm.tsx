import styles from "@styles/components/chat/ChatForm.module.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useSelector } from "react-redux";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";

const ChatForm = () => {
  const selectedChat = useSelector(QuoteSelectors.getActiveChat);
  const [textMessage, setTextMessage] = useState("");

  // Sample function, will delete
  let test = () => {
    const text: string = textMessage;
    setTextMessage("");
    console.log(textMessage);
  };

  return (
    <div className="p-inputgroup">
      <InputText
        placeholder="Type a message"
        value={textMessage}
        onChange={(e) => setTextMessage(e.target.value)}
        disabled={selectedChat === null}
      />
      {/* TODO: Onclick functionality */}
      <Button icon="pi pi-send" className={styles.button} onClick={test} />
    </div>
  );
};

export default ChatForm;
