import { createMessage } from "@redux/actions/quoteAction";
import styles from "@styles/components/chat/ChatForm.module.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";

/**
 * Creates and handles the chat form to enter a message
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 02/13/2023
 * @returns A react component for the message bar
 */
const ChatForm = () => {
  const selectedChat = useSelector(QuoteSelectors.getActiveChat);
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();

  const submitMessage = () => {
    if (selectedChat && textMessage !== "") {
      dispatch(createMessage({ quoteId: selectedChat, message: textMessage }));
    }
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
      <Button
        icon="pi pi-send"
        className={styles.button}
        disabled={textMessage === ""}
        onClick={submitMessage}
      />
    </div>
  );
};

export default ChatForm;
