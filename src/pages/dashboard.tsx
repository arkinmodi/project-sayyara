import { NextPage } from "next";
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

export default React.memo(CustomerDashboard);
