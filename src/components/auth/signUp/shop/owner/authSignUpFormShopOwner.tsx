import { createShopOwnerSignup } from "@redux/actions/authActions";
import { getCsrfToken } from "next-auth/react";
import { DropdownChangeParams } from "primereact/dropdown";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
  shopAddress: "",
  shopProvince: "",
  shopPostalCode: "",
  shopName: "",
  shopPhoneNumber: "",
  shopCity: "",
};

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
    // TODO: validate inputs
    dispatch(createShopOwnerSignup(formValues));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
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
