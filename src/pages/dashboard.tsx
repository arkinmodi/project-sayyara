import CustomerAppointments from "@components/appointments/customer/customerAppointments";
import { UserType } from "@prisma/client";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { TabPanel, TabView, TabViewTabChangeParams } from "primereact/tabview";
import React from "react";
import QuotesShell from "src/components/quotes/shell";

import { useEffect, useState } from "react";

const CustomerDashboard: NextPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { tab } = router.query;

  useEffect(() => {
    if (typeof tab === "string") {
      if (tab === "quotes") {
        setActiveIndex(0);
      } else if (tab === "service-requests") {
        setActiveIndex(1);
      }
    }
  }, [tab]);

  const handleTabChange = (e: TabViewTabChangeParams) => {
    setActiveIndex(e.index);
  };

  return (
    <div style={{ height: "100%" }}>
      <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
        <TabPanel header="Quotes">
          <QuotesShell />
        </TabPanel>
        <TabPanel header="Service Requests">
          <CustomerAppointments />
        </TabPanel>
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
