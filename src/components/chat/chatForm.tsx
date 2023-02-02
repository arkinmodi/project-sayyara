import styles from "@styles/components/chat/ChatForm.module.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

const ChatForm = ({ selectedChat, onMessageSubmit }) => {
  const [textMessage, setTextMessage] = useState("");

  // Sample function, will delete
  let test = () => {
    console.log(textMessage);
  };

  return (
    <div className="p-inputgroup">
      <InputText
        placeholder="Type a message"
        value={textMessage}
        onChange={(e) => setTextMessage(e.target.value)}
      />
      {/* TODO: Onclick functionality */}
      <Button icon="pi pi-send" className={styles.button} onClick={test} />
    </div>
  );
};

export default ChatForm;
