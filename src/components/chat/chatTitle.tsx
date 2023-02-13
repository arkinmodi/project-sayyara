import { UserType } from "@prisma/client";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/components/chat/ChatTitle.module.css";
import classnames from "classnames";
import Image from "next/image";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import {
  InputNumber,
  InputNumberValueChangeParams,
} from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import img from "public/icons/icon-192x192.png";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";
import { IQuote, IQuoteList } from "src/types/quotes";

const ChatTitle = () => {
  let chatTitleContents = null;

  const userType = useSelector(AuthSelectors.getUserType);
  const selectedChatId = useSelector(QuoteSelectors.getActiveChat);
  const quotes: IQuoteList = useSelector(QuoteSelectors.getQuotes);

  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [description, setDescription] = useState("");

  const menu = useRef<Menu>(null);

  const onHide = () => {
    setPrice(0);
    setTime(0);
    setDescription("");
    setIsOpen(false);
  };

  const sendInvite = () => {
    // TODO
    console.log(price, time, description);
  };

  const checkFields = () => {
    return price <= 0 || time <= 0 || description === "";
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          className="greenButton"
          label="Send Invite"
          disabled={checkFields()}
          onClick={sendInvite}
        />
      </div>
    );
  };

  const onPriceChange = (e: InputNumberValueChangeParams) => {
    if (e.value) {
      setPrice(e.value);
    }
  };

  const onTimeChange = (e: InputNumberValueChangeParams) => {
    if (e.value) {
      setTime(e.value);
    }
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const items = [
    {
      label: "Invite to Schedule",
      icon: "pi pi-calendar",
      command: () => {
        // Opens a dialog to fill in estimated price, time and description
        setIsOpen(true);
        // Adds information to the specified quote
      },
    },
  ];

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (menu.current) {
      menu.current.toggle(e);
    }
  };

  if (selectedChatId !== null) {
    const selectedChat: IQuote = quotes[selectedChatId]!;
    const name: string =
      userType === UserType.CUSTOMER
        ? `${selectedChat.shop.name} - ${selectedChat.service.name}`
        : `${selectedChat.customer.first_name} - ${selectedChat.service.name}`;
    chatTitleContents = (
      <>
        {/* Conversation image */}
        <Image
          className={styles.image}
          src={img}
          alt={name}
          // TODO Figure out height/width ratios
          height={img.height * 0.25}
          width={img.width * 0.4}
        />
        {/* Conversation name */}
        <span className={styles.span}>{name}</span>
        <div className={styles.inviteDiv}>
          <Menu model={items} popup ref={menu} id="invite menu" />
          <Button
            className={classnames("blueButton", styles.inviteButton)}
            icon="pi pi-ellipsis-v"
            visible={
              userType === UserType.SHOP_OWNER || userType === UserType.EMPLOYEE
            }
            disabled={userType === UserType.CUSTOMER}
            onClick={toggleMenu}
          />
        </div>
      </>
    );
  }

  return (
    <div className={styles.chatTitle}>
      {chatTitleContents}
      <Dialog
        header="Invite to Schedule"
        visible={isOpen}
        onHide={onHide}
        className={styles.dialog}
        footer={renderFooter}
      >
        <div className={styles.dialogInputCol}>
          <div className={styles.dialogInputRow}>
            <div className={styles.fill}>
              <p>Estimated Price ($)</p>
              <InputNumber
                value={price}
                className={styles.maxWidth}
                onValueChange={onPriceChange}
                mode="currency"
                currency="CAD"
              />
            </div>
            <div className={styles.fill}>
              <p>Estimated Time (Hours)</p>
              <InputNumber
                value={time}
                className={styles.maxWidth}
                onValueChange={onTimeChange}
                mode="decimal"
                minFractionDigits={0}
                maxFractionDigits={2}
              />
            </div>
          </div>
          <div className={styles.dialogInputRow}>
            <div className={styles.maxWidth}>
              <p>Description of Service</p>
              <InputText
                value={description}
                className={styles.maxWidth}
                onChange={onDescriptionChange}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ChatTitle;
