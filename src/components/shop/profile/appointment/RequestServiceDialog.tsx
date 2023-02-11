import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/components/shop/profile/appointment/RequestServiceDialog.module.css";
import { default as classnames, default as classNames } from "classnames";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IService, ServiceType } from "src/types/service";
import { IShop } from "src/types/shop";

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
  date: Date | null;
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
          date: null,
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
          date: null,
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
    }
    return Array.from(Array(7).keys());
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
                  <InputText value={form.year} disabled={preloaded} />
                </div>
                <div>
                  <p>Vehicle Make</p>
                  <InputText value={form.make} disabled={preloaded} />
                </div>
                <div>
                  <p>Vehicle Model</p>
                  <InputText value={form.model} disabled={preloaded} />
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
                  />
                </div>
              </div>
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
              <div className={styles.dialogInputRow}>
                <div className={styles.maxWidth}>
                  <p>Description</p>
                  <InputText
                    value={form.description}
                    className={styles.maxWidth}
                  />
                </div>
              </div>
              <div
                className={classnames(styles.dialogInputRow, styles.buttonRow)}
              >
                <Button className="blueButton" label="Back" onClick={goBack} />
                <Button className="greenButton" label={displayButton()} />
              </div>
            </div>
          );
        }
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
