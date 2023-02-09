import authStyles from "@styles/components/auth/Auth.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent, useState } from "react";
import { IAuthSignUpFormShopOwnerValues } from "src/components/auth/types";
import { PROVINCES } from "src/constants/provinces";
import {
  validateEmail,
  validatePhoneNumber,
  validatePostalCode,
} from "src/utils/formValidationUtil";

interface IShopDetailsSectionProps {
  formValues: IAuthSignUpFormShopOwnerValues;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDropDownChange: (dropdownParams: DropdownChangeParams) => void;
  handleSubmit: () => void;
  prevStep: () => void;
}

const ShopDetailsSection = (props: IShopDetailsSectionProps) => {
  const [isShopNameValid, setIsShopNameValid] = useState(true);
  const [isShopAddressValid, setIsShopAddressValid] = useState(true);
  const [isShopPostalCodeValid, setShopIsPostalCodeValid] = useState(true);
  const [isShopCityValid, setIsShopCityValid] = useState(true);
  const [isShopProvinceValid, setIsShopProvinceValid] = useState(true);
  const [isShopEmailValid, setIsShopEmailValid] = useState(true);
  const [isShopPhoneNumberValid, setIsShopPhoneNumberValid] = useState(true);

  const {
    formValues,
    handleInputChange,
    handleDropDownChange,
    prevStep,
    handleSubmit,
  } = props;

  const validateInputs = () => {
    const isValidShopEmail = validateEmail(formValues.shopEmail);
    setIsShopEmailValid(isValidShopEmail);

    const isValidShopName = formValues.shopName.length > 0;
    setIsShopNameValid(isValidShopName);

    const isValidShopAddress = formValues.shopAddress.length > 0;
    setIsShopAddressValid(isValidShopAddress);

    const isValidShopCity = formValues.shopCity.length > 0;
    setIsShopCityValid(isValidShopCity);

    const isValidShopPostalCode = validatePostalCode(formValues.shopPostalCode);
    setShopIsPostalCodeValid(isValidShopPostalCode);

    const isValidShopProvince = formValues.shopProvince.length > 0;
    setIsShopProvinceValid(isValidShopProvince);

    const isValidShopPhoneNumber = validatePhoneNumber(
      formValues.shopPhoneNumber
    );
    setIsShopPhoneNumberValid(isValidShopPhoneNumber);

    return (
      isValidShopEmail &&
      isValidShopName &&
      isValidShopAddress &&
      isValidShopCity &&
      isValidShopPostalCode &&
      isValidShopProvince &&
      isValidShopPhoneNumber
    );
  };

  const handleSubmitButtonClick = () => {
    if (validateInputs()) {
      handleSubmit();
    }
  };

  return (
    <div>
      <div className={authStyles.authForm}>
        <div className={authStyles.authFormBody}>
          <label htmlFor="authSignUpFormShopEmployeeShopNameInput">
            Shop Name (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormShopOwnerShopNameInput"
            placeholder="Shop Name"
            className={classNames(
              authStyles.authFormInput,
              !isShopNameValid ? "p-invalid block" : ""
            )}
            value={formValues.shopName}
            onChange={handleInputChange}
            name="shopName"
          />
          <small
            id="shopNameHelp"
            className={!isShopNameValid ? "p-error block" : "p-hidden"}
          >
            Shop name is required
          </small>
          <br />
          <label htmlFor="authSignUpFormShopOwnerShopAddressInput">
            Shop Address (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormShopOwnerShopAddressInput"
            placeholder="Shop Address"
            className={classNames(
              authStyles.authFormInput,
              !isShopAddressValid ? "p-invalid block" : ""
            )}
            value={formValues.shopAddress}
            onChange={handleInputChange}
            name="shopAddress"
          />
          <small
            id="shopAddressHelp"
            className={!isShopAddressValid ? "p-error block" : "p-hidden"}
          >
            Shop address is required
          </small>
          <br />
          <label htmlFor="authSignUpFormShopOwnerShopCityInput">
            City (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormShopOwnerShopCityInput"
            placeholder="City"
            className={classNames(
              authStyles.authFormInput,
              !isShopCityValid ? "p-invalid block" : ""
            )}
            value={formValues.shopCity}
            onChange={handleInputChange}
            name="shopCity"
          />
          <small
            id="shopCityHelp"
            className={!isShopCityValid ? "p-error block" : "p-hidden"}
          >
            City is required
          </small>
          <br />
          <label htmlFor="authSignUpFormCustomerShopProvinceDropdown">
            Province (Required)
          </label>
          <br />
          <Dropdown
            id="authSignUpFormCustomerShopProvinceDropdown"
            className={classNames(
              authStyles.authFormDropdown,
              !isShopProvinceValid ? "p-invalid block" : ""
            )}
            value={formValues.shopProvince}
            options={PROVINCES}
            onChange={handleDropDownChange}
            filter
            showClear
            placeholder="Select a province"
            name="shopProvince"
          />
          <small
            id="shopProvinceHelp"
            className={!isShopProvinceValid ? "p-error block" : "p-hidden"}
          >
            Shop province is required
          </small>
          <br />
          <label htmlFor="authSignUpFormShopOwnerShopPostalCodeInput">
            Postal Code (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormShopOwnerShopPostalCodeInput"
            placeholder="Postal Code"
            className={classNames(
              authStyles.authFormInput,
              !isShopPostalCodeValid ? "p-invalid block" : ""
            )}
            value={formValues.shopPostalCode}
            onChange={handleInputChange}
            name="shopPostalCode"
          />
          <small
            id="shopPostalCodeHelp"
            className={!isShopPostalCodeValid ? "p-error block" : "p-hidden"}
          >
            Shop postal code is required
          </small>
          <br />
          <label htmlFor="authSignUpFormShopEmailInput">
            Shop Email (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormShopEmailInput"
            className={classNames(
              authStyles.authFormInput,
              !isShopEmailValid ? "p-invalid block" : ""
            )}
            value={formValues.shopEmail}
            onChange={handleInputChange}
            name="shopEmail"
            placeholder="Shop Email"
          />
          <small
            id="shopEmailHelp"
            className={!isShopEmailValid ? "p-error block" : "p-hidden"}
          >
            Shop email is invalid
          </small>
          <br />
          <label htmlFor="authSignUpFormShopPhoneNumberInput">
            Shop Phone Number (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormShopPhoneNumberInput"
            className={classNames(
              authStyles.authFormInput,
              !isShopPhoneNumberValid ? "p-invalid block" : ""
            )}
            value={formValues.shopPhoneNumber}
            onChange={handleInputChange}
            name="shopPhoneNumber"
            placeholder="Shop Phone Number"
          />
          <small
            id="shopPhoneNumberHelp"
            className={!isShopPhoneNumberValid ? "p-error block" : "p-hidden"}
          >
            Phone number is invalid
          </small>

          <br />
        </div>
        <div className={authStyles.authFormButtonGroup}>
          <Button
            label="Back"
            className={authStyles.authFormButtonMinimal}
            onClick={prevStep}
          />
          <Button
            label="Submit"
            className={authStyles.authFormButton}
            onClick={handleSubmitButtonClick}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ShopDetailsSection);
