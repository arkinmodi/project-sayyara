import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import AuthTypes from "src/redux/types/authTypes";
import authStyles from "../../styles/pages/auth/Auth.module.css";

interface ISignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: string;
}

const initialSignUpFormValues: ISignUpFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  type: "SHOP_OWNER",
};

// TODO: account types are currently disabled and commented out
const Register: NextPage = ({
  csrfToken,
  callbackUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [formValues, setFormValues] = useState<ISignUpFormValues>(
    initialSignUpFormValues
  );
  // const [accountType, setAccountType] = useState(0);

  const router = useRouter();
  const dispatch = useDispatch();

  // const handleAccountTypeChange = (
  //   event: React.FormEvent<HTMLInputElement>
  // ) => {
  //   if (
  //     event?.currentTarget &&
  //     (event.currentTarget as HTMLInputElement).value
  //   ) {
  //     setAccountType(Number((event.currentTarget as HTMLInputElement).value));
  //   }
  // };

  const handleSignUpButtonClick = (): void => {
    // TODO: validate inputs
    dispatch({
      type: AuthTypes.CREATE_SIGN_UP,
      payload: { ...formValues, csrfToken, callbackUrl },
    });
  };

  const handleLoginButtonClick = () => {
    const href = {
      pathname: "/auth/login",
      query: { callbackUrl },
    };
    router.push(href);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <div className={authStyles.authContainer}>
      <Card className={authStyles.authFormCard}>
        <div className={authStyles.authFormCardHeader}>
          <i className="pi pi-user-plus" style={{ fontSize: "2em" }} />
          <h1>Sign Up</h1>
        </div>
        <div className={authStyles.authForm}>
          <label htmlFor="authSignUpFormEmailInput">Email (Required)</label>
          <br />
          <InputText
            id="authSignUpFormEmailInput"
            placeholder="Email"
            className={authStyles.authFormInput}
            value={formValues.email}
            onChange={handleInputChange}
            name="email"
          />
          <br />
          <label htmlFor="authSignUpFormPasswordInput">
            Password (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormPasswordInput"
            type="password"
            className={authStyles.authFormInput}
            placeholder="Password"
            value={formValues.password}
            onChange={handleInputChange}
            name="password"
          />
          <br />
          <label htmlFor="authSignUpFormFirstNameInput">
            First Name (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormFirstNameInput"
            className={authStyles.authFormInput}
            placeholder="First Name"
            value={formValues.firstName}
            onChange={handleInputChange}
            name="firstName"
          />
          <br />
          <label htmlFor="authSignUpFormLastNameInput">
            Last Name (Required)
          </label>
          <br />
          <InputText
            id="authSignUpFormLastNameInput"
            className={authStyles.authFormInput}
            placeholder="Last Name"
            value={formValues.lastName}
            onChange={handleInputChange}
            name="lastName"
          />
          <div className={authStyles.authFormButtonGroup}>
            <Button
              label="Sign Up"
              className={authStyles.authFormButton}
              onClick={handleSignUpButtonClick}
            />
            <Button
              label="Login"
              className={`${authStyles.authFormButton} p-button-text`}
              onClick={handleLoginButtonClick}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  const callbackUrl = context.query.callbackUrl;

  if (session && !Array.isArray(callbackUrl)) {
    return {
      redirect: {
        destination: callbackUrl ?? "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
      callbackUrl: Array.isArray(callbackUrl) ? "/" : callbackUrl,
    },
  };
};

export default Register;
