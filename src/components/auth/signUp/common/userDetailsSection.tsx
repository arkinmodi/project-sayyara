import authStyles from "@styles/components/auth/Auth.module.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent } from "react";
import {
  IAuthSignUpFormShopEmployeeValues,
  IAuthSignUpFormShopOwnerValues,
  IAuthSignUpFormValues,
} from "../../types";

interface IUserDetailsSectionProps {
  formValues:
    | IAuthSignUpFormValues
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
        <label htmlFor="authSignUpFormFirstNameInput">
          First Name (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormFirstNameInput"
          className={authStyles.authFormInput}
          value={formValues.firstName}
          onChange={handleInputChange}
          name="firstName"
          placeholder="First Name"
        />
        <br />
        <label htmlFor="authSignUpFormLastNameInput">
          Last Name (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormLastNameInput"
          className={authStyles.authFormInput}
          value={formValues.lastName}
          onChange={handleInputChange}
          name="lastName"
          placeholder="Last Name"
        />
        <br />
        <label htmlFor="authSignUpFormEmailInput">Email (Required)</label>
        <br />
        <InputText
          id="authSignUpFormEmailInput"
          className={authStyles.authFormInput}
          value={formValues.email}
          onChange={handleInputChange}
          name="email"
          placeholder="Email"
        />
        <br />
        <label htmlFor="authSignUpFormPhoneInput">
          Phone Number (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormPhoneNumberInput"
          className={authStyles.authFormInput}
          value={formValues.phoneNumber}
          onChange={handleInputChange}
          name="phoneNumber"
          placeholder="Phone Number"
        />
        <br />
        <label htmlFor="authSignUpFormPasswordInput">Password (Required)</label>
        <br />
        <InputText
          id="authSignUpFormPasswordInput"
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
