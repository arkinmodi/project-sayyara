import authStyles from "@styles/pages/auth/Auth.module.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent } from "react";
import { IAuthSignUpFormShopEmployeeValues } from "src/components/auth/types";

interface IShopDetailsSectionProps {
  formValues: IAuthSignUpFormShopEmployeeValues;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  prevStep: () => void;
}

const ShopDetailsSection = (props: IShopDetailsSectionProps) => {
  const { formValues, handleInputChange, prevStep, handleSubmit } = props;

  return (
    <div className={authStyles.authForm}>
      <div className={authStyles.authFormBody}>
        <label htmlFor="authSignUpFormShopEmployeeShopIdInput">
          Shop ID (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormVehicleOwnerShopNameInput"
          placeholder="Shop ID"
          className={authStyles.authFormInput}
          value={formValues.shopId}
          onChange={handleInputChange}
          name="shopId"
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
  );
};

export default React.memo(ShopDetailsSection);
