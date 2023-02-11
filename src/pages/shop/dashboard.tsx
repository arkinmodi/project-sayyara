import { UserType } from "@prisma/client";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { GetServerSideProps, NextPage } from "next";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import AppointmentsTab from "src/components/appointments/shop/appointmentsTabs";

const ShopDashboard: NextPage = () => {
  return (
    <div>
      <TabView>
        <TabPanel header="Quotes"></TabPanel>
        <TabPanel header="Service Requests">
          
          <AppointmentsTab />
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
