import authStyles from "@styles/components/auth/Auth.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent, useState } from "react";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "src/utils/formValidationUtil";
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
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateInputs = () => {
    const isValidEmail = validateEmail(formValues.email);
    setIsEmailValid(isValidEmail);

    const isValidFirstName = formValues.firstName.length > 0;
    setIsFirstNameValid(isValidFirstName);

    const isValidLastName = formValues.lastName.length > 0;
    setIsLastNameValid(isValidLastName);

    const isValidPhoneNumber = validatePhoneNumber(formValues.phoneNumber);
    setIsPhoneNumberValid(isValidPhoneNumber);

    const isValidPassword = validatePassword(formValues.password);
    setIsPasswordValid(isValidPassword);

    return (
      isValidEmail &&
      isValidFirstName &&
      isValidLastName &&
      isValidPhoneNumber &&
      isValidPassword
    );
  };

  const handleNextButtonClick = () => {
    if (validateInputs()) {
      nextStep();
    }
  };

  return (
    <div className={authStyles.authForm}>
      <div className={authStyles.authFormBody}>
        <label htmlFor="authSignUpFormFirstNameInput">
          First Name (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormFirstNameInput"
          className={classNames(
            authStyles.authFormInput,
            !isFirstNameValid ? "p-invalid block" : ""
          )}
          value={formValues.firstName}
          onChange={handleInputChange}
          name="firstName"
          placeholder="First Name"
        />
        <small
          id="firstNameHelp"
          className={!isFirstNameValid ? "p-error block" : "p-hidden"}
        >
          First name is required
        </small>
        <br />
        <label htmlFor="authSignUpFormLastNameInput">
          Last Name (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormLastNameInput"
          className={classNames(
            authStyles.authFormInput,
            !isLastNameValid ? "p-invalid block" : ""
          )}
          value={formValues.lastName}
          onChange={handleInputChange}
          name="lastName"
          placeholder="Last Name"
        />
        <small
          id="lastNameHelp"
          className={!isLastNameValid ? "p-error block" : "p-hidden"}
        >
          Last name is required
        </small>
        <br />
        <label htmlFor="authSignUpFormEmailInput">Email (Required)</label>
        <br />
        <InputText
          id="authSignUpFormEmailInput"
          className={classNames(
            authStyles.authFormInput,
            !isEmailValid ? "p-invalid block" : ""
          )}
          value={formValues.email}
          onChange={handleInputChange}
          name="email"
          placeholder="Email"
        />
        <small
          id="emailHelp"
          className={!isEmailValid ? "p-error block" : "p-hidden"}
        >
          Email is invalid
        </small>
        <br />
        <label htmlFor="authSignUpFormPhoneInput">
          Phone Number (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormPhoneNumberInput"
          className={classNames(
            authStyles.authFormInput,
            !isPhoneNumberValid ? "p-invalid block" : ""
          )}
          value={formValues.phoneNumber}
          onChange={handleInputChange}
          name="phoneNumber"
          placeholder="Phone Number"
        />
        <small
          id="phoneNumberHelp"
          className={!isPhoneNumberValid ? "p-error block" : "p-hidden"}
        >
          Phone number is invalid
        </small>
        <br />
        <label htmlFor="authSignUpFormPasswordInput">Password (Required)</label>
        <br />
        <InputText
          id="authSignUpFormPasswordInput"
          type="password"
          placeholder="Password"
          className={classNames(
            authStyles.authFormInput,
            !isPasswordValid ? "p-invalid block" : ""
          )}
          value={formValues.password}
          onChange={handleInputChange}
          name="password"
        />
        <small
          id="passwordHelp"
          className={!isPasswordValid ? "p-error block" : "p-hidden"}
        >
          Password is invalid
        </small>
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
          onClick={handleNextButtonClick}
        />
      </div>
    </div>
  );
};

export default React.memo(UserDetailsSection);
