import { createShopOwnerSignup } from "@redux/actions/authActions";
import { getCsrfToken } from "next-auth/react";
import { DropdownChangeParams } from "primereact/dropdown";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  formatName,
  formatPhoneNumber,
  formatPostalCode,
} from "src/utils/formFormatUtil";
import { IAuthSignUpFormShopOwnerValues } from "../../../types";
import UserDetailsSection from "../../common/userDetailsSection";
import ShopDetailsSection from "./shopDetailsSection";

interface IAuthSignUpFormShopOwnerProps {
  resetShopSignUp: () => void;
}
const initialAuthSignUpFormShopOwnerValues: IAuthSignUpFormShopOwnerValues = {
  csrfToken: "",
  email: "",
  phoneNumber: "",
  password: "",
  firstName: "",
  lastName: "",
  shopName: "",
  shopAddress: "",
  shopProvince: "",
  shopPostalCode: "",
  shopPhoneNumber: "",
  shopCity: "",
  shopEmail: "",
};

/**
 * Display current form section for shop owners (user details and shop information)
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @date 02/10/2023
 * @param {IAuthSignUpFormShopOwnerProps} props - Shop owner sign up props
 * @returns A react form containing the current form section
 */
const AuthSignUpFormShopOwner = (props: IAuthSignUpFormShopOwnerProps) => {
  const [formValues, setFormValues] = useState<IAuthSignUpFormShopOwnerValues>({
    ...initialAuthSignUpFormShopOwnerValues,
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
    dispatch(createShopOwnerSignup(formValues));
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
      case "shopEmail":
        return (value as string).toLowerCase();
      case "shopPostalCode":
        return formatPostalCode(value as string);
      case "shopPhoneNumber":
        return formatPhoneNumber(value as string);
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
            prevStep={resetShopSignUp}
          />
        );
      case 2:
        return (
          <ShopDetailsSection
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

export default React.memo(AuthSignUpFormShopOwner);
