import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import Services from "../../components/manage/services";

const ManageShopTabs = () => {
  return (
    <TabView>
      <TabPanel header="Services">
        <Services />
      </TabPanel>
      <TabPanel header="Employees">
        {/* TODO: Add manage employees page here */}
      </TabPanel>
    </TabView>
  );
};

export default React.memo(ManageShopTabs);
