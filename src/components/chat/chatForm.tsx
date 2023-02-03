import { createMessage } from "@redux/actions/quoteAction";
import styles from "@styles/components/chat/ChatForm.module.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";

const ChatForm = () => {
  const selectedChat = useSelector(QuoteSelectors.getActiveChat);
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();

  // Sample function, will delete
  const submitMessage = () => {
    dispatch(createMessage({ id: selectedChat, message: textMessage }));
    setTextMessage("");
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
      <Button
        icon="pi pi-send"
        className={styles.button}
        onClick={submitMessage}
      />
    </div>
  );
};

export default ChatForm;
