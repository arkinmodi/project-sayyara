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

  const prevStep = () => {
    setStep(step - 1);
  };

  const nextStep = () => {
    setStep(step + 1);
  };

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

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormValues({
      ...formValues,
      [name]: typeof value === "string" ? formatValue(name, value) : value,
    });
  };

  const handleDropDownChange = (dropdownParams: DropdownChangeParams) => {
    const value = dropdownParams.value;
    const name = dropdownParams.target.name;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

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
