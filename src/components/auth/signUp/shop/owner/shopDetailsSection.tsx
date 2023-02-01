import authStyles from "@styles/components/auth/Auth.module.css";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent } from "react";
import { IAuthSignUpFormShopOwnerValues } from "src/components/auth/types";
import { PROVINCES } from "src/constants/provinces";

interface IShopDetailsSectionProps {
  formValues: IAuthSignUpFormShopOwnerValues;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDropDownChange: (dropdownParams: DropdownChangeParams) => void;
  handleSubmit: () => void;
  prevStep: () => void;
}

const ShopDetailsSection = (props: IShopDetailsSectionProps) => {
  const {
    formValues,
    handleInputChange,
    handleDropDownChange,
    prevStep,
    handleSubmit,
  } = props;

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
            className={authStyles.authFormInput}
            value={formValues.shopName}
            onChange={handleInputChange}
            name="shopName"
          />
          <br />
          <label htmlFor="authSignUpFormShopOwnerShopAddressInput">
            Shop Address (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormShopOwnerShopAddressInput"
            placeholder="Shop Address"
            className={authStyles.authFormInput}
            value={formValues.shopAddress}
            onChange={handleInputChange}
            name="shopAddress"
          />
          <br />
          <label htmlFor="authSignUpFormShopOwnerShopCityInput">
            Shop City (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormShopOwnerShopCityInput"
            placeholder="Shop City"
            className={authStyles.authFormInput}
            value={formValues.shopCity}
            onChange={handleInputChange}
            name="shopCity"
          />
          <br />
          <label htmlFor="authSignUpFormCustomerShopProvinceDropdown">
            Province (Required)
          </label>
          <br />
          <Dropdown
            id="authSignUpFormCustomerShopProvinceDropdown"
            className={authStyles.authFormDropdown}
            value={formValues.shopProvince}
            options={PROVINCES}
            onChange={handleDropDownChange}
            filter
            showClear
            placeholder="Select a province"
            name="shopProvince"
          />
          <br />
          <label htmlFor="authSignUpFormShopEmailInput">
            Shop Email (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormShopEmailInput"
            className={authStyles.authFormInput}
            value={formValues.shopEmail}
            onChange={handleInputChange}
            name="shopEmail"
            placeholder="Shop Email"
          />
          <br />
          <label htmlFor="authSignUpFormShopPhoneNumberInput">
            Shop Phone Number (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormShopPhoneNumberInput"
            className={authStyles.authFormInput}
            value={formValues.shopPhoneNumber}
            onChange={handleInputChange}
            name="shopPhoneNumber"
            placeholder="Shop Phone Number"
          />
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
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ShopDetailsSection);
