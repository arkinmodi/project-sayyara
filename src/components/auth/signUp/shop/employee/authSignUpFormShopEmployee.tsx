import { createShopEmployeeSignUp } from "@redux/actions/authActions";
import { getCsrfToken } from "next-auth/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { formatName, formatPhoneNumber } from "src/utils/formFormatUtil";
import { IAuthSignUpFormShopEmployeeValues } from "../../../types";
import UserDetailsSection from "../../common/userDetailsSection";
import ShopIdSection from "./shopIdSection";

interface IAuthSignUpFormShopEmployeeProps {
  resetShopSignUp: () => void;
}
const initialAuthSignUpFormShopEmployeeValues: IAuthSignUpFormShopEmployeeValues =
  {
    csrfToken: "",
    email: "",
    phoneNumber: "",
    password: "",
    firstName: "",
    lastName: "",
    shopId: "",
  };

const AuthSignUpFormShopEmployee = (
  props: IAuthSignUpFormShopEmployeeProps
) => {
  const [formValues, setFormValues] =
    useState<IAuthSignUpFormShopEmployeeValues>({
      ...initialAuthSignUpFormShopEmployeeValues,
    });
  const [step, setStep] = useState<number>(1);
  const { resetShopSignUp } = props;

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
    if (step === 1) {
      resetShopSignUp();
    } else {
      setStep(step - 1);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const handleSignUpButtonClick = (): void => {
    dispatch(createShopEmployeeSignUp(formValues));
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

  const getFormSection = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return (
          <UserDetailsSection
            formValues={formValues}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={resetShopSignUp}
          />
        );
      case 2:
        return (
          <ShopIdSection
            formValues={formValues}
            handleInputChange={handleInputChange}
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

export default React.memo(AuthSignUpFormShopEmployee);
