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

/**
 * Renders the dialog popup for creating a service request
 * Popup is only for logged in customer users
 * Contains the multi-stage dialog for selecting specific service
 * and selecting appointment time, if applicable, or generates a new quote
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 02/13/2023
 * @param {IRequestServiceDialog} props - Props for the dialog
 * @returns The react dialog popup containing the forms for creating a service request
 */
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

  // Handles the closure of the dialog window
  const hideDialog = () => {
    setStep(1);
    onHide();
  };

  // Handles moving back a step in the dialog window
  const goBack = () => {
    setStep(step - 1);
  };

  /**
   * Handles the changing of the service in the dropdown
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/12/2023
   * @param {DropdownChangeParams} e - Primereact dropdown change parameters
   */
  const onServiceChange = (e: DropdownChangeParams) => {
    const value = e.value;
    setSelectedService(value);
  };

  /**
   * Display text based on type of service for the submit button
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/12/2023
   * @returns A string containing the text for the submit button
   */
  const displayButtonText = () => {
    if (typeof selectedService === "string") {
      return "Schedule Service";
    } else {
      return selectedService.type === ServiceType.CANNED
        ? "Schedule Service"
        : "Proceed to Quote";
    }
  };

  /**
   * Handles the submission of the first step's form
   * Create appointment, or create quote, based on service type
   * Store information and move to next step
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/12/2023
   */
  const onSubmitStepOne = () => {
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

  /**
   * Sets form data with current customer's data
   * Current customer data would include the car information linked to the customer user
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/12/2023
   * @param {React.ChangeEvent<HTMLInputElement>} e - React change event parameter
   * @param {string} field - The form field being set
   */
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

  /**
   * Handles on selection of a timeslot in the appointments calendar
   * Generates an end time based off of the appointment duration and given start time
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/12/2023
   * @param {StartTimeEventEmit} e - React schedule meeting parameters
   */
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

  /**
   * Renders the cost and time form fields of the service
   * Can come preloaded if service already has existing information
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/12/2023
   * @returns A react component for the form fields of cost and time of the service
   */
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

  /**
   * Renders the form field of the description for the service
   * Can come preloaded if service has existing description
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/13/2023
   * @returns A react component for the description form field
   */
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

  /**
   * Handles the submission of the second step's form
   * Two cases:
   * 1. Service is a CANNED (basic) service, immediately go to step 3 for appointment scheduling
   * 2. Service is a CUSTOM service, create a quote and move to quotes page
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/13/2023
   */
  const onSubmitStepTwo = () => {
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

  /**
   * Handles the submission of the third step's form
   * This step is only for basic/canned services
   * Generates a appointment request with the given appointment time
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/12/2023
   */
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

  /**
   * Renders the current step's form based on where the user is at in the service request flow
   *
   * @param {IAvailabilitiesTime[]} availableTimeslots - An array of available appointment timeslots
   * @returns A react form
   */
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
