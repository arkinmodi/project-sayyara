import { UserType } from "@prisma/client";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { GetServerSideProps, NextPage } from "next";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import QuotesShell from "src/components/quotes/shell";

const CustomerDashboard: NextPage = () => {
  return (
    <div style={{ height: "100%" }}>
      <TabView>
        <TabPanel header="Quotes">
          <QuotesShell />
        </TabPanel>
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
