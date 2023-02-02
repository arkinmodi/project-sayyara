import { UserType } from "@prisma/client";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { GetServerSideProps, NextPage } from "next";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";

const CustomerDashboard: NextPage = () => {
  return (
    <div>
      <TabView>
        <TabPanel header="Quotes"></TabPanel>
        <TabPanel header="Service Requests"></TabPanel>
      </TabView>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (session && session.user.type !== UserType.CUSTOMER) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default React.memo(CustomerDashboard);
