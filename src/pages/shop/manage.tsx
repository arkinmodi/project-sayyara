import { UserType } from "@prisma/client";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { GetServerSideProps } from "next";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";

const ManageShopTabs = () => {
  return (
    <TabView>
      <TabPanel header="Services">
        {/* TODO: Add manage services page here */}
      </TabPanel>
      <TabPanel header="Employees">
        {/* TODO: Add manage employees page here */}
      </TabPanel>
    </TabView>
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

export default React.memo(ManageShopTabs);
