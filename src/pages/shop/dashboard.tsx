import AppointmentsTabs from "@components/appointments/shop/appointmentsTabs";
import QuotesShell from "@components/quotes/shell";
import { UserType } from "@prisma/client";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { TabPanel, TabView, TabViewTabChangeParams } from "primereact/tabview";
import React, { useEffect, useState } from "react";

const ShopDashboard: NextPage = () => {
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
    <div>
      <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
        <TabPanel header="Quotes">
          <QuotesShell />
        </TabPanel>
        <TabPanel header="Service Requests">
          <AppointmentsTabs />
        </TabPanel>
      </TabView>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (
    session &&
    session.user.type !== UserType.EMPLOYEE &&
    session.user.type !== UserType.SHOP_OWNER
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default React.memo(ShopDashboard);
