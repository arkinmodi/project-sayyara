import { NextPage } from "next";
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

export default React.memo(ShopDashboard);
