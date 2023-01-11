import authStyles from "@styles/components/auth/Auth.module.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent } from "react";
import {
  IAuthSignUpFormCustomerValues,
  IAuthSignUpFormShopEmployeeValues,
  IAuthSignUpFormShopOwnerValues,
} from "../../types";

interface IUserDetailsSectionProps {
  formValues:
    | IAuthSignUpFormCustomerValues
    | IAuthSignUpFormShopOwnerValues
    | IAuthSignUpFormShopEmployeeValues;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep?: () => void;
}
const UserDetailsSection = (props: IUserDetailsSectionProps) => {
  const { formValues, handleInputChange, nextStep, prevStep } = props;

  return (
    <div className={authStyles.authForm}>
      <div className={authStyles.authFormBody}>
        <label htmlFor="authSignUpFormCustomerFirstNameInput">
          First Name (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormCustomerFirstNameInput"
          className={authStyles.authFormInput}
          value={formValues.firstName}
          onChange={handleInputChange}
          name="firstName"
          placeholder="First Name"
        />
        <br />
        <label htmlFor="authSignUpFormCustomerLastNameInput">
          Last Name (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormCustomerLastNameInput"
          className={authStyles.authFormInput}
          value={formValues.lastName}
          onChange={handleInputChange}
          name="lastName"
          placeholder="Last Name"
        />
        <br />
        <label htmlFor="authSignUpFormCustomerEmailInput">
          Email (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormCustomerEmailInput"
          className={authStyles.authFormInput}
          value={formValues.email}
          onChange={handleInputChange}
          name="email"
          placeholder="Email"
        />
        <br />
        <label htmlFor="authSignUpFormCustomerPasswordInput">
          Password (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormCustomerPasswordInput"
          type="password"
          placeholder="Password"
          className={authStyles.authFormInput}
          value={formValues.password}
          onChange={handleInputChange}
          name="password"
        />
      </div>
      <div className={authStyles.authFormButtonGroup}>
        {prevStep ? (
          <Button
            label="Back"
            className={authStyles.authFormButtonMinimal}
            onClick={prevStep}
          />
        ) : (
          <></>
        )}
        <Button
          label="Next"
          className={authStyles.authFormButton}
          onClick={nextStep}
        />
      </div>
    </div>
  );
};

export default React.memo(UserDetailsSection);
