import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  FormGroup,
  Icon,
  InputGroup,
} from "@blueprintjs/core";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import AuthTypes from "src/redux/types/authTypes";
import authStyles from "../../styles/pages/auth/Auth.module.css";

interface ISignUpFormValues {
  callbackUrl: string | string[];
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  type: string;
}

const initialSignUpFormValues: ISignUpFormValues = {
  callbackUrl: "/",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  type: "SHOP_OWNER",
};

const Register: NextPage = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  const [formValues, setFormValues] = useState(initialSignUpFormValues);
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
    const callbackUrl = router.query.callbackUrl;
    if (callbackUrl) {
      setFormValues({ ...formValues, callbackUrl });
    }
    dispatch({ type: AuthTypes.CREATE_SIGN_UP, payload: formValues });
  };

  const handleLoginButtonClick = () => {
    const href = {
      pathname: "/auth/login",
      query: { callbackUrl: router.query.callbackUrl },
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
      <Card
        className={authStyles.authFormCard}
        interactive={false}
        elevation={Elevation.THREE}
      >
        <div className={authStyles.authFormCardHeader}>
          <Icon icon="user" size={80} />
          <h1>Sign Up</h1>
        </div>
        <div className={authStyles.authForm}>
          {/* <RadioGroup
            label="Account Type"
            onChange={handleAccountTypeChange}
            selectedValue={accountType}
          >
            <Radio label="Customer" value={0} />
            <Radio label="Shop Owner" value={1} />
            <Radio label="Employee" value={2} />
          </RadioGroup> */}
          <FormGroup label="Email" labelFor="text-input" labelInfo="(Required)">
            <InputGroup
              id="text-input"
              placeholder="Email"
              className={authStyles.authFormInput}
              value={formValues.email}
              onChange={handleInputChange}
              name="email"
            />
          </FormGroup>
          <FormGroup
            label="Password"
            labelFor="text-input"
            labelInfo="(Required)"
          >
            <InputGroup
              id="text-input"
              type="password"
              className={authStyles.authFormInput}
              placeholder="Password"
              value={formValues.password}
              onChange={handleInputChange}
              name="password"
            />
          </FormGroup>
          <FormGroup
            label="First Name"
            labelFor="text-input"
            labelInfo="(Required)"
          >
            <InputGroup
              id="text-input"
              type="text"
              className={authStyles.authFormInput}
              placeholder="First Name"
              value={formValues.firstName}
              onChange={handleInputChange}
              name="firstName"
            />
          </FormGroup>
          <FormGroup
            label="Last Name"
            labelFor="text-input"
            labelInfo="(Required)"
          >
            <InputGroup
              id="text-input"
              type="text"
              className={authStyles.authFormInput}
              placeholder="Last Name"
              value={formValues.lastName}
              onChange={handleInputChange}
              name="lastName"
            />
          </FormGroup>
          <ButtonGroup className={authStyles.authFormButtonGroup}>
            <Button
              intent="primary"
              className={authStyles.authFormButton}
              onClick={handleSignUpButtonClick}
            >
              Sign Up
            </Button>
            <Button
              intent="primary"
              className={authStyles.authFormButton}
              minimal
              onClick={handleLoginButtonClick}
            >
              Login
            </Button>
          </ButtonGroup>
        </div>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const callbackUrl = context.query.callbackUrl;
  const session = await getServerAuthSession(context);

  if (session && !Array.isArray(callbackUrl)) {
    return {
      redirect: {
        destination: callbackUrl ?? "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Register;
