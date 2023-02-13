import { createAppointment } from "@redux/actions/appointmentAction";
import { createQuote } from "@redux/actions/quoteAction";
import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/components/shop/profile/appointment/RequestServiceDialog.module.css";
import classnames from "classnames";
import Router from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleMeeting, StartTimeEventEmit } from "react-schedule-meeting";
import { AppointmentStatus } from "src/types/appointment";
import { IService, ServiceType } from "src/types/service";
import { IAvailabilitiesTime, IShop } from "src/types/shop";
import { getAvailabilities } from "src/utils/shopUtil";

interface IRequestServiceDialog {
  visible: boolean;
  onHide: () => void;
  shopId: string;
  shop: IShop;
  basicServices: IService[];
  customServices: IService[];
}

interface ICreateAppointmentForm {
  vehicleId: string;
  year: number | string;
  make: string;
  model: string;
  service: string;
  startTime: Date | undefined;
  endTime: Date | undefined;
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
  const [availableTimeslots, setAvailableTimeslots] = useState<
    IAvailabilitiesTime[]
  >([]);
  const [allowSubmit, setAllowSubmit] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const vehicle = useSelector(AuthSelectors.getVehicleInfo);
  const customerId = useSelector(AuthSelectors.getUserId);
  const customerAppointments = useSelector(
    AppointmentSelectors.getAppointments
  );

  useEffect(() => {
    const startDate = new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = new Date(
      new Date(new Date().setDate(startDate.getDate() + 30)).setHours(
        23,
        59,
        59,
        59
      )
    );
    getAvailabilities(
      shopId,
      startDate,
      endDate,
      shop.hoursOfOperation ?? null
    ).then((data) => {
      if (data) {
        setAvailableTimeslots(data);
      }
    });
  }, [shop?.hoursOfOperation, customerAppointments]);

  const hideDialog = () => {
    setStep(1);
    onHide();
  };

  const goBack = () => {
    setStep(step - 1);
  };

  const onServiceChange = (e: DropdownChangeParams) => {
    const value = e.value;
    setSelectedService(value);
  };

  const displayButtonText = () => {
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
          vehicleId: vehicle.id,
          year: vehicle.year,
          make: vehicle.make,
          model: vehicle.model,
          service: selectedService.name,
          startTime: undefined,
          endTime: undefined,
          cost: selectedService.totalPrice,
          time: selectedService.estimatedTime,
          description: selectedService.description,
        };
      } else {
        form = {
          vehicleId: "",
          year: "",
          make: "",
          model: "",
          service: selectedService.name,
          startTime: undefined,
          endTime: undefined,
          cost: selectedService.totalPrice,
          time: selectedService.estimatedTime,
          description: selectedService.description,
        };
      }
      setForm(form);
      setStep(2);
    }
  };

  const setFormData = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (form && field) {
      let _form = { ...form };
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

  const onTimeSelect = (e: StartTimeEventEmit) => {
    if (form) {
      let _form = form;
      _form.startTime = e.startTime;
      _form.endTime = new Date(
        e.startTime.getTime() + Math.ceil(form.time * 60) * 60000
      );
      setForm(_form);
      setAllowSubmit(true);
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
            <InputText
              disabled={true}
              value={form.description}
              className={styles.maxWidth}
            />
          </div>
        </div>
      );
    }
  };

  const onSubmitStepTwo = () => {
    // Two cases:
    // 1. Service is a CANNED service, immediately go to step 3 for appointment scheduling
    // 2. Service is a CUSTOM service, create a quote and move to quotes page
    if (typeof selectedService !== "string") {
      if (selectedService.type === ServiceType.CANNED) {
        setAllowSubmit(false);
        setStep(3);
      } else {
        // CUSTOM Service, create quote
        if (customerId) {
          dispatch(
            createQuote({ customerId, shopId, serviceId: selectedService.id })
          );
          Router.push("/dashboard/");
        }
      }
    }
  };

  const onSubmitStepThree = () => {
    if (
      form &&
      form.startTime &&
      form.endTime &&
      typeof selectedService !== "string" &&
      customerId
    ) {
      const body = {
        shopId: shopId,
        customerId: customerId,
        serviceId: selectedService.id,
        vehicleId: form.vehicleId,
        quoteId: undefined,
        price: form.cost,
        status: AppointmentStatus.PENDING_APPROVAL,
        startTime: form.startTime.toString(),
        endTime: form.endTime.toString(),
      };

      dispatch(createAppointment(body));
    }
    // Toast success
    hideDialog();
  };

  const renderStep = (availableTimeslots: IAvailabilitiesTime[]) => {
    switch (step) {
      case 1:
        return (
          <div className={styles.dialogContainer}>
            <h3>Select a Service</h3>
            <Dropdown
              className={styles.dialogDropdown}
              value={selectedService}
              options={allServices}
              onChange={onServiceChange}
              optionLabel="name"
            />
            <Button
              className={classnames(styles.dialogButton, "greenButton")}
              disabled={selectedService === ""}
              onClick={onSubmitStepOne}
            >
              {displayButtonText()}
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
              </div>
              {renderCostAndTime()}
              {renderDescription()}
              <div
                className={classnames(styles.dialogInputRow, styles.buttonRow)}
              >
                <Button className="blueButton" label="Back" onClick={goBack} />
                <Button
                  className={classnames(styles.dialogButton, "greenButton")}
                  label={displayButtonText()}
                  onClick={onSubmitStepTwo}
                />
              </div>
            </div>
          );
        }
      case 3:
        if (form) {
          return (
            <div className={styles.dialogInputCol}>
              <ScheduleMeeting
                borderRadius={10}
                primaryColor="#436188"
                backgroundColor="#f7f7f7"
                eventDurationInMinutes={Math.ceil(form.time * 60)}
                availableTimeslots={availableTimeslots}
                onStartTimeSelect={onTimeSelect}
              />
              <div
                className={classnames(styles.dialogInputRow, styles.buttonRow)}
              >
                <Button className="blueButton" label="Back" onClick={goBack} />
                <Button
                  className={classnames(styles.dialogButton, "greenButton")}
                  label={displayButtonText()}
                  disabled={!allowSubmit}
                  onClick={onSubmitStepThree}
                />
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
        header={"Request a service"}
        draggable={false}
        className={styles.requestDialog}
      >
        {renderStep(availableTimeslots)}
      </Dialog>
    </div>
  );
};

export default RequestServiceDialog;
