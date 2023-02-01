import { TabPanel, TabView } from "primereact/tabview";
import React from "react";

const ManageShopTabs = () => {
  return (
    <TabView>
      <TabPanel header="Services">
        {/* TODO: Add manage services page here */}
      </TabPanel>
      <TabPanel header="Employees">
        {/* //TODO: Add manage employees page here */}
      </TabPanel>
    </TabView>
  );
};

export default React.memo(ManageShopTabs);
