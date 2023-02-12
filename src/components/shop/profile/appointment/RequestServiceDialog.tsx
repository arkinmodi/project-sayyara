import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/components/shop/profile/appointment/RequestServiceDialog.module.css";
import { default as classnames, default as classNames } from "classnames";
import { Button } from "primereact/button";
import { Calendar, CalendarChangeParams } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IService, ServiceType } from "src/types/service";
import { IShop, IShopHoursOfOperation } from "src/types/shop";

const mapDayToNumber: { [key: string]: number } = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};
interface IRequestServiceDialog {
  visible: boolean;
  onHide: () => void;
  shopId: string;
  shop: IShop;
  basicServices: IService[];
  customServices: IService[];
}

interface ICreateAppointmentForm {
  year: number | string;
  make: string;
  model: string;
  service: string;
  date: Date | undefined;
  cost: number;
  time: number;
  description: string;
}

const RequestServiceDialog = (props: IRequestServiceDialog) => {
  const dispatch = useDispatch();

  const { visible, onHide, shopId, shop, basicServices, customServices } =
    props;
  const allServices = [...basicServices, ...customServices];
  const [selectedService, setSelectedService] = useState<string | IService>("");
  const [preloaded, setPreloaded] = useState<boolean>(false);
  const [form, setForm] = useState<ICreateAppointmentForm>();
  const [step, setStep] = useState<number>(1);

  const vehicle = useSelector(AuthSelectors.getVehicleInfo);

  const hideDialog = () => {
    setStep(1);
    onHide();
  };

  const goBack = () => {
    let _step = step;
    setStep(--_step);
  };

  const onServiceChange = (e: { value: any }) => {
    setSelectedService(e.value);
  };

  const displayButton = () => {
    if (typeof selectedService === "string") {
      return "Schedule Service";
    } else {
      return selectedService.type === ServiceType.CANNED
        ? "Schedule Service"
        : "Proceed to Quote";
    }
  };

  const onSubmitStepOne = () => {
    // Create appointment, or create quote, based on service type
    // Store information and move to next step
    if (typeof selectedService !== "string") {
      let form: ICreateAppointmentForm;
      if (vehicle) {
        setPreloaded(true);
        form = {
          year: vehicle.year,
          make: vehicle.make,
          model: vehicle.model,
          service: selectedService.name,
          date: undefined,
          cost: selectedService.totalPrice,
          time: selectedService.estimatedTime,
          description: selectedService.description,
        };
      } else {
        form = {
          year: "",
          make: "",
          model: "",
          service: selectedService.name,
          date: undefined,
          cost: selectedService.totalPrice,
          time: selectedService.estimatedTime,
          description: selectedService.description,
        };
      }
      setForm(form);
      setStep(2);
    }
  };

  const disabledDays = () => {
    const hoursOfOperation = shop.hoursOfOperation;
    if (hoursOfOperation) {
      let dayList: number[] = [];
      for (let day in mapDayToNumber) {
        if (
          !hoursOfOperation[day as keyof IShopHoursOfOperation].isOpen &&
          typeof mapDayToNumber[day] !== "undefined"
        ) {
          dayList.push(mapDayToNumber[day]!);
        }
      }
      return dayList;
    }
    return Array.from(Array(7).keys());
  };

  const setFormData = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (form && field) {
      let _form = form;
      switch (field) {
        case "year":
          _form.year = parseInt(e.target.value);
          break;
        case "make":
          break;
        case "model":
          break;
      }
      setForm(_form);
    }
  };

  const setDate = (e: CalendarChangeParams) => {
    if (form) {
      let _form = form;
      _form.date = e.value as Date;
      setForm(_form);
    }
  };

  const renderCostAndTime = () => {
    if (
      form &&
      typeof selectedService !== "string" &&
      selectedService.type === ServiceType.CANNED
    ) {
      return (
        <div className={styles.dialogInputRow}>
          <div className={styles.fill}>
            <p>Estimated Cost ($)</p>
            <InputText
              value={form.cost}
              disabled={preloaded}
              className={styles.maxWidth}
            />
          </div>
          <div className={styles.fill}>
            <p>Estimated Time (Hours)</p>
            <InputText
              value={form.time}
              disabled={preloaded}
              className={styles.maxWidth}
            />
          </div>
        </div>
      );
    }
  };

  const renderDescription = () => {
    if (
      form &&
      typeof selectedService !== "string" &&
      selectedService.type !== ServiceType.CANNED
    ) {
      return (
        <div className={styles.dialogInputRow}>
          <div className={styles.maxWidth}>
            <p>Description</p>
            <InputText value={form.description} className={styles.maxWidth} />
          </div>
        </div>
      );
    }
  };

  const onSubmitStepTwo = () => {
    // Two cases:
    // 1. Service is a CANNED service, immediately go to step 3 for appointment scheduling
    // 2. Service is a CUSTOM service, create a quote and move to quotes page
    console.log(form);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.dialogContainer}>
            <h3>Request a Service</h3>
            <Dropdown
              className={styles.dialogDropdown}
              value={selectedService}
              options={allServices}
              onChange={onServiceChange}
              optionLabel="name"
            />
            <Button
              className={classNames(styles.dialogButton, "greenButton")}
              disabled={selectedService === ""}
              onClick={onSubmitStepOne}
            >
              {displayButton()}
            </Button>
          </div>
        );
      case 2:
        // Second window, shows vehicle information
        if (form) {
          return (
            <div className={styles.dialogInputCol}>
              <div className={styles.dialogInputRow}>
                <div>
                  <p>Vehicle Year</p>
                  <InputText
                    value={form.year}
                    disabled={preloaded}
                    onChange={(e) => setFormData(e, "year")}
                  />
                </div>
                <div>
                  <p>Vehicle Make</p>
                  <InputText
                    value={form.make}
                    disabled={preloaded}
                    onChange={(e) => setFormData(e, "make")}
                  />
                </div>
                <div>
                  <p>Vehicle Model</p>
                  <InputText
                    value={form.model}
                    disabled={preloaded}
                    onChange={(e) => setFormData(e, "model")}
                  />
                </div>
              </div>
              <div className={styles.dialogInputRow}>
                <div className={styles.fill}>
                  <p>Service</p>
                  <InputText
                    value={form.service}
                    disabled
                    className={styles.maxWidth}
                  />
                </div>
                <div className={styles.fill}>
                  <p>Appointment Date</p>
                  <Calendar
                    className={styles.maxWidth}
                    readOnlyInput
                    minDate={new Date()} // Sets first date to be today
                    disabledDays={disabledDays()}
                    onChange={setDate}
                  />
                </div>
              </div>
              <div>{renderCostAndTime()}</div>
              <div>{renderDescription()}</div>
              <div
                className={classnames(styles.dialogInputRow, styles.buttonRow)}
              >
                <Button className="blueButton" label="Back" onClick={goBack} />
                <Button
                  className="greenButton"
                  label={displayButton()}
                  onClick={onSubmitStepTwo}
                />
              </div>
            </div>
          );
        }
      case 3:
        // Select a timeslot from a predefined list of timeslots
        return;
      default:
        break;
    }
  };

  return (
    <div>
      <Dialog
        visible={visible}
        onHide={hideDialog}
        header={shop.name}
        draggable={false}
        className={styles.requestDialog}
      >
        {renderStep()}
      </Dialog>
    </div>
  );
};

export default React.memo(RequestServiceDialog);
