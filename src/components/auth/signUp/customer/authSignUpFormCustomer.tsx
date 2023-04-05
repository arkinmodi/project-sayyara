import { createCustomerSignUp } from "@redux/actions/authActions";
import { getCsrfToken } from "next-auth/react";
import { DropdownChangeParams } from "primereact/dropdown";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { formatName, formatPhoneNumber } from "src/utils/formFormatUtil";
import { IAuthSignUpFormCustomerValues } from "../../types";
import UserDetailsSection from "../common/userDetailsSection";
import VehicleDetailsSection from "./vehicleDetailsSection";

const initialAuthSignUpFormCustomerValues: IAuthSignUpFormCustomerValues = {
  csrfToken: "",
  email: "",
  phoneNumber: "",
  password: "",
  firstName: "",
  lastName: "",
  vehicleModel: "",
  vehicleMake: "",
  vehicleYear: null,
  vin: "",
  licensePlate: "",
};

/**
 * Creates the sign up forms for a customer user
 * Holds both the general user sign up and the specific customer sign up components
 * User information, and car information
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @date 02/10/2023
 * @returns A react form containing the two sign up forms related to customers
 */
const AuthSignUpFormCustomer = () => {
  const [formValues, setFormValues] = useState<IAuthSignUpFormCustomerValues>({
    ...initialAuthSignUpFormCustomerValues,
  });
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    async function fetchCSRF() {
      if (formValues.csrfToken == "") {
        try {
          const res = await getCsrfToken();
          if (!!res) {
            setFormValues({ ...formValues, csrfToken: res });
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
    fetchCSRF();
  }, [formValues]);

  const dispatch = useDispatch();

  // Moves back a step to the first form
  const prevStep = () => {
    setStep(step - 1);
  };

  // Moves forward a step to the next form
  const nextStep = () => {
    setStep(step + 1);
  };

  // Handles the sign up button click
  const handleSignUpButtonClick = (): void => {
    if (formValues.vehicleYear != null) {
      dispatch(
        createCustomerSignUp({
          ...formValues,
          // Assert value is non-null
          vehicleYear: formValues.vehicleYear!,
        })
      );
    }
  };

  /**
   * Formats input values depending on the field
   *
   * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
   * @date 02/10/2023
   * @param {string} name - The field name
   * @param {any} value - The field value
   * @returns A formatted value
   */
  const formatValue = (name: string, value: any) => {
    switch (name) {
      case "email":
        return (value as string).toLowerCase();
      case "phoneNumber":
        return formatPhoneNumber(value as string);
      case "firstName":
        return formatName(value as string);
      case "lastName":
        return formatName(value as string);
      case "vin":
        return (value as string).toUpperCase().replace(/\s/g, "");
      case "licensePlate":
        // Remove all spaces to accommodate for different province formats
        return (value as string).toUpperCase().replace(/\s/g, "");
      default:
        return value;
    }
  };

  /**
   * Handles form input changes
   *
   * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
   * @date 02/10/2023
   * @param {ChangeEvent<HTMLInputElement>} event - React change event
   */
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormValues({
      ...formValues,
      [name]: typeof value === "string" ? formatValue(name, value) : value,
    });
  };

  /**
   * Handles changes in form dropdown
   *
   * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
   * @date 01/09/2023
   * @param dropdownParams
   */
  const handleDropDownChange = (dropdownParams: DropdownChangeParams) => {
    const value = dropdownParams.value;
    const name = dropdownParams.target.name;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  /**
   * Display current form section (either user details or vehicle details)
   *
   * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
   * @date 01/09/2023
   * @param {number} currentStep - Current form step
   * @returns A react form containing the current form section
   */
  const getFormSection = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          <UserDetailsSection
            formValues={formValues}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <VehicleDetailsSection
            formValues={formValues}
            handleInputChange={handleInputChange}
            handleDropDownChange={handleDropDownChange}
            prevStep={prevStep}
            handleSubmit={handleSignUpButtonClick}
          />
        );
      default:
      // do nothing
    }
  };

  return <div>{getFormSection(step)}</div>;
};

export default React.memo(AuthSignUpFormCustomer);
