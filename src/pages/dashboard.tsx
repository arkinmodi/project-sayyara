import { NextPage } from "next";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import QuotesDashboard from "../components/quotes/dashboard";

const CustomerDashboard: NextPage = () => {
  return (
    <div>
      <TabView>
        <TabPanel header="Quotes">
          <QuotesDashboard />
        </TabPanel>
        <TabPanel header="Service Requests"></TabPanel>
      </TabView>
    </div>
  );
};

export default React.memo(CustomerDashboard);
