import { QuoteStatus, UserType } from "@prisma/client";
import { createAppointment } from "@redux/actions/appointmentAction";
import { acceptQuote, inviteCustomer } from "@redux/actions/quoteAction";
import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
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
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleMeeting, StartTimeEventEmit } from "react-schedule-meeting";
import { QuoteSelectors } from "src/redux/selectors/quoteSelectors";
import { AppointmentStatus } from "src/types/appointment";
import { IQuote, IQuoteList } from "src/types/quotes";
import { IAvailabilitiesTime } from "src/types/shop";
import { getAvailabilities } from "src/utils/shopUtil";

interface IChatTitleProps {
  prevPage: () => void;
}

const ChatTitle = (props: IChatTitleProps) => {
  const { prevPage } = props;
  const dispatch = useDispatch();
  let chatTitleContents = null;

  const userType = useSelector(AuthSelectors.getUserType);
  const selectedChatId = useSelector(QuoteSelectors.getActiveChat);
  const quotes: IQuoteList = useSelector(QuoteSelectors.getQuotes);
  const customerAppointments = useSelector(
    AppointmentSelectors.getAppointments
  );
  const vehicle = useSelector(AuthSelectors.getVehicleInfo);

  const [isOpen, setIsOpen] = useState(false);
  const [invitationIsOpen, setInvitationIsOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [description, setDescription] = useState("");

  // step for creating appointment
  const [step, setStep] = useState(0);
  const [availableTimeslots, setAvailableTimeslots] = useState<
    IAvailabilitiesTime[] | []
  >([]);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [allowSubmit, setAllowSubmit] = useState<boolean>(false);

  const menu = useRef<Menu>(null);

  useEffect(() => {
    if (selectedChatId) {
      const selectedChat: IQuote = quotes[selectedChatId]!;
      const startDate = new Date(new Date().setHours(0, 0, 0, 0));
      const endDate = new Date(
        new Date(new Date().setDate(startDate.getDate() + 30)).setHours(
          23,
          59,
          59,
          59
        )
      );
      if (selectedChat.shop.id) {
        getAvailabilities(
          selectedChat.shop.id,
          startDate,
          endDate,
          selectedChat.shop.hoursOfOperation ?? null
        ).then((data) => {
          if (data) {
            setAvailableTimeslots(data);
          }
        });
      }
    }
  }, [selectedChatId, customerAppointments]);

  const onHide = () => {
    setPrice(0);
    setTime(0);
    setDescription("");
    setIsOpen(false);
  };

  const invitationOnHide = () => {
    setInvitationIsOpen(false);
  };

  const sendInvite = () => {
    // TODO
    if (selectedChatId) {
      dispatch(
        inviteCustomer({
          quoteId: selectedChatId,
          price,
          duration: time,
          description,
        })
      );

      onHide();
    }
  };

  const bookAppointment = () => {
    setStep(step + 1);
  };

  const goBack = () => {
    setStep(step - 1);
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

  const onTimeSelect = (e: StartTimeEventEmit) => {
    if (selectedChatId) {
      const selectedChat = quotes[selectedChatId];
      if (selectedChat && selectedChat.duration) {
        const startTime = e.startTime;
        const endTime = new Date(
          e.startTime.getTime() + Math.ceil(selectedChat.duration * 60) * 60000
        );

        setStartTime(startTime);
        setEndTime(endTime);
        setAllowSubmit(true);
      }
    }
  };

  const onSubmitAppointment = () => {
    if (selectedChatId) {
      const selectedChat = quotes[selectedChatId];
      if (selectedChat && selectedChat.shop.id && selectedChat.price) {
        if (vehicle) {
          const body = {
            shopId: selectedChat.shop.id,
            customerId: selectedChat.customer.id,
            serviceId: selectedChat.service.id,
            vehicleId: vehicle.id,
            quoteId: selectedChatId,
            price: selectedChat.price,
            status: AppointmentStatus.PENDING_APPROVAL,
            startTime: startTime.toString(),
            endTime: endTime.toString(),
          };

          dispatch(createAppointment(body));

          // Set quote status to accepted
          dispatch(acceptQuote({ quoteId: selectedChatId }));
        }
      }

      invitationOnHide();
    }
  };

  const items = [
    {
      label: "Invite to Schedule",
      icon: "pi pi-calendar",
      command: () => {
        // Opens a dialog to fill in estimated price, time and description
        setIsOpen(true);
      },
    },
  ];

  const toggleMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (menu.current) {
      menu.current.toggle(e);
    }
  };

  const openScheduleDialog = () => {
    if (selectedChatId) {
      const selectedChat: IQuote = quotes[selectedChatId]!;
      if (
        selectedChat.status === QuoteStatus.INVITED &&
        userType === UserType.CUSTOMER
      ) {
        setInvitationIsOpen(true);
      }
    }
  };

  const renderInvitationDialog = (
    availableTimeslots: IAvailabilitiesTime[]
  ) => {
    if (selectedChatId) {
      const selectedChat: IQuote = quotes[selectedChatId]!;
      if (
        selectedChat.price &&
        selectedChat.duration &&
        selectedChat.description
      ) {
        switch (step) {
          case 0:
            return (
              <div className={styles.dialogInputCol}>
                <h4>Here are the service details:</h4>
                <div className={styles.dialogInputRow}>
                  <div className={styles.fill}>
                    <p>Estimated Price ($)</p>
                    <InputNumber
                      disabled
                      value={selectedChat.price}
                      className={styles.maxWidth}
                      mode="currency"
                      currency="CAD"
                    />
                  </div>
                  <div className={styles.fill}>
                    <p>Estimated Time (Hours)</p>
                    <InputNumber
                      disabled
                      value={selectedChat.duration}
                      className={styles.maxWidth}
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
                      disabled
                      value={selectedChat.description}
                      className={styles.maxWidth}
                    />
                  </div>
                </div>
                <div
                  className={classnames(
                    styles.dialogInputRow,
                    styles.invitationButton
                  )}
                >
                  <Button
                    className="greenButton"
                    label="Book Appointment"
                    onClick={bookAppointment}
                  />
                </div>
              </div>
            );
          case 1:
            return (
              <div className={styles.dialogInputCol}>
                <ScheduleMeeting
                  borderRadius={10}
                  primaryColor="#436188"
                  backgroundColor="#f7f7f7"
                  eventDurationInMinutes={Math.ceil(selectedChat.duration * 60)}
                  availableTimeslots={availableTimeslots}
                  onStartTimeSelect={onTimeSelect}
                />
                <div
                  className={classnames(
                    styles.dialogInputRow,
                    styles.buttonRow
                  )}
                >
                  <Button
                    className="blueButton"
                    label="Back"
                    onClick={goBack}
                  />
                  <Button
                    className={classnames(styles.dialogButton, "greenButton")}
                    label="Schedule Service"
                    disabled={!allowSubmit}
                    onClick={onSubmitAppointment}
                  />
                </div>
              </div>
            );
          default:
            return;
        }
      }
    }
  };

  const checkIfMobile = (selectedChat: IQuote, name: string) => {
    return (
      <>
        <i
          className={classnames("pi pi-angle-left", styles.mobileImage)}
          onClick={prevPage}
        ></i>
        <Image
          className={classnames(styles.image, styles.desktopImage)}
          src={img}
          alt={name}
          // TODO Figure out height/width ratios
          height={img.height * 0.25}
          width={img.width * 0.4}
        />
      </>
    );
  };

  if (selectedChatId) {
    const selectedChat: IQuote = quotes[selectedChatId]!;

    const name: string =
      userType === UserType.CUSTOMER
        ? `${selectedChat.shop.name} - ${selectedChat.service.name}`
        : `${selectedChat.customer.first_name} - ${selectedChat.service.name}`;
    chatTitleContents = (
      <>
        {/* Conversation image or back button, if mobile*/}
        {checkIfMobile(selectedChat, name)}
        {/* Conversation name */}
        <span className={styles.span}>{name}</span>
        <div className={styles.inviteDiv}>
          <Menu model={items} popup ref={menu} id="invite menu" />
          <Button
            className={classnames("greenButton", styles.inviteButton)}
            icon={
              userType === UserType.CUSTOMER
                ? "pi pi-calendar-plus"
                : "pi pi-ellipsis-v"
            }
            visible={
              ((userType === UserType.SHOP_OWNER ||
                userType === UserType.EMPLOYEE) &&
                selectedChat.status === QuoteStatus.IN_PROGRESS) ||
              (userType === UserType.CUSTOMER &&
                selectedChat.status === QuoteStatus.INVITED)
            }
            onClick={
              userType === UserType.CUSTOMER ? openScheduleDialog : toggleMenu
            }
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
      <Dialog
        header="Book Your Appointment"
        visible={invitationIsOpen}
        onHide={invitationOnHide}
        className={styles.dialog}
      >
        {renderInvitationDialog(availableTimeslots)}
      </Dialog>
    </div>
  );
};

export default ChatTitle;
