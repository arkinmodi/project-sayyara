import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { getServerAuthSession } from "@server/common/getServerAuthSession";

const Register: NextPage = () => {
  const router = useRouter();
  return (
    <div>
      <form method="post" action="/api/user/register">
        <input
          name="callBackUrl"
          type="hidden"
          defaultValue={router.query.callbackUrl ?? "/"}
        />
        <label>
          Email
          <input name="email" type="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <label>
          First Name
          <input name="firstName" type="text" />
        </label>
        <label>
          Last Name
          <input name="lastName" type="text" />
        </label>
        <button type="submit">Register</button>
      </form>
      <Link
        href={{
          pathname: "/auth/login",
          query: { callbackUrl: router.query.callbackUrl },
        }}
      >
        <button>Already Have An Account?</button>
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const callBackUrl = context.query.callbackUrl;
  const session = await getServerAuthSession(context);

  if (session && !Array.isArray(callBackUrl)) {
    return {
      redirect: {
        destination: callBackUrl ?? "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Register;
