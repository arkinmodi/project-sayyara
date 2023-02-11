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
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  service: string;
  appointmentDate: Date;
  estimatedCost: number;
  estimatedTime: number;
  description: string;
}

const RequestServiceDialog = (props: IRequestServiceDialog) => {
  const dispatch = useDispatch();

  const vehicle = useSelector(AuthSelectors.getVehicleInfo);

  const { visible, onHide, shopId, shop, basicServices, customServices } =
    props;
  const allServices = [...basicServices, ...customServices];
  const [selectedService, setSelectedService] = useState<string | IService>("");
  const [formInfo, setFormInfo] = useState<ICreateAppointmentForm>();
  const [step, setStep] = useState<number>(1);

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
      setStep(2);
    }
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
        return (
          <div className={styles.dialogInputCol}>
            <div className={styles.dialogInputRow}>
              <div>
                <p>Vehicle Year</p>
                <InputText value={"test"} />
              </div>
              <div>
                <p>Vehicle Make</p>
                <InputText value={"test"} />
              </div>
              <div>
                <p>Vehicle Model</p>
                <InputText value={"test"} />
              </div>
            </div>
            <div className={styles.dialogInputRow}>
              <div className={styles.fill}>
                <p>Service</p>
                <InputText value={"test"} className={styles.maxWidth} />
              </div>
              <div className={styles.fill}>
                <p>Appointment Date</p>
                <Calendar className={styles.maxWidth} />
              </div>
            </div>
            <div className={styles.dialogInputRow}>
              <div className={styles.fill}>
                <p>Estimated Cost</p>
                <InputText value={"test"} className={styles.maxWidth} />
              </div>
              <div className={styles.fill}>
                <p>Estimated Time</p>
                <InputText value={"test"} className={styles.maxWidth} />
              </div>
            </div>
            <div className={styles.dialogInputRow}>
              <div className={styles.maxWidth}>
                <p>Description</p>
                <InputText value={"test"} className={styles.maxWidth} />
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
