import authStyles from "@styles/components/auth/Auth.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent, useState } from "react";
import { IAuthSignUpFormShopEmployeeValues } from "src/components/auth/types";
import { getShopId } from "src/utils/shopUtil";

interface IShopDetailsSectionProps {
  formValues: IAuthSignUpFormShopEmployeeValues;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  prevStep: () => void;
}

const ShopDetailsSection = (props: IShopDetailsSectionProps) => {
  const [isShopIdValid, setIsShopIdValid] = useState(true);
  const { formValues, handleInputChange, prevStep, handleSubmit } = props;

  const handleSubmitButtonClick = () => {
    const shopId = formValues.shopId;
    if (shopId.length > 0) {
      getShopId(shopId).then((shopData) => {
        if (shopData) {
          handleSubmit();
        } else {
          setIsShopIdValid(false);
        }
      });
    } else {
      setIsShopIdValid(false);
    }
  };

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
          className={classNames(
            authStyles.authFormDropdown,
            !isShopIdValid ? "p-invalid block" : ""
          )}
          value={formValues.shopId}
          onChange={handleInputChange}
          name="shopId"
        />
        <small
          id="shopIdHelp"
          className={!isShopIdValid ? "p-error block" : "p-hidden"}
        >
          Shop ID is invalid
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
  );
};

export default React.memo(ShopDetailsSection);
