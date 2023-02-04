import { UserType } from "@prisma/client";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import { GetServerSideProps } from "next";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import EmployeeTable from "src/components/employees/employeeTable";
import Services from "../../components/manage/services";

const ManageShopTabs = () => {
  return (
    <TabView>
      <TabPanel header="Services">
        <Services />
      </TabPanel>
      <TabPanel header="Employees">
        <EmployeeTable />
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
