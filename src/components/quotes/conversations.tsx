import styles from "@styles/components/quotes/Conversations.module.css";
import Image from "next/image";
import { ListBox, ListBoxChangeParams } from "primereact/listbox";
import image from "public/icons/icon-192x192.png";
import { useState } from "react";

interface IChatItem {
  name: string;
  address: string;
  lastUpdated: string;
}

const Conversations = () => {
  const [selectedChat, setChat] = useState(null);
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

  const chatItem = (option: IChatItem) => {
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
          {"Create " + option.lastUpdated}
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
        options={temp}
        onChange={(e: ListBoxChangeParams) => setChat(e.value)}
        filterBy="name"
        itemTemplate={chatItem}
        listStyle={{ maxHeight: "32.5rem" }}
      />
    </div>
  );
};

export default Conversations;
