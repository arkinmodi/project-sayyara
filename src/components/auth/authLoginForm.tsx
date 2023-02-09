import { createLogin } from "@redux/actions/authActions";
import classNames from "classnames";
import { getCsrfToken } from "next-auth/react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { validateEmail } from "src/utils/formValidationUtil";
import authStyles from "../../styles/components/auth/Auth.module.css";
import { ILoginFormValues } from "./types";

const initialLoginFormValues: ILoginFormValues = {
  csrfToken: "",
  email: "",
  password: "",
};

const AuthLoginForm = () => {
  const [formValues, setFormValues] = useState<ILoginFormValues>({
    ...initialLoginFormValues,
  });
  const [isEmailValid, setIsEmailValid] = useState(true);

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

  const formatValue = (name: string, value: any) => {
    switch (name) {
      case "email":
        return (value as string).toLowerCase();
      default:
        return value;
    }
  };

  const validateInputs = () => {
    const isValidEmail = validateEmail(formValues.email);
    setIsEmailValid(isValidEmail);

    return isValidEmail;
  };

  const handleLoginButtonClick = (): void => {
    if (validateInputs()) {
      dispatch(createLogin(formValues));
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormValues({
      ...formValues,
      [name]: typeof value === "string" ? formatValue(name, value) : value,
    });
  };

  return (
    <div className={authStyles.authForm}>
      <div className={authStyles.authFormBody}>
        <label htmlFor="authLoginFormEmailInput">Email (Required)</label>
        <br />
        <InputText
          id="authLoginFormEmailInput"
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
        <label htmlFor="authLoginFormPasswordInput">Password (Required)</label>
        <br />
        <InputText
          id="authLoginFormPasswordInput"
          type="password"
          placeholder="Password"
          className={authStyles.authFormInput}
          value={formValues.password}
          onChange={handleInputChange}
          name="password"
        />
      </div>
      <div className={authStyles.authFormButtonGroup}>
        <Button
          label="Login"
          className={authStyles.authFormButton}
          onClick={handleLoginButtonClick}
        />
      </div>
    </div>
  );
};

export default React.memo(AuthLoginForm);
