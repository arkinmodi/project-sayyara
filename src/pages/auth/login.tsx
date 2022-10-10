import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from "next";
import { getCsrfToken, getSession } from "next-auth/react";

const Login: NextPage = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <form method="post" action="/api/auth/callback/credentials">
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button type="submit">Sign in</button>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const callBackUrl = context.query.callbackUrl;
  const session = await getSession();

  if (session && !Array.isArray(callBackUrl)) {
    return {
      redirect: {
        destination: callBackUrl ?? "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

export default Login;
