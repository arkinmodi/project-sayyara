import { TabPanel, TabView } from "primereact/tabview";
import Requested from "./requested";

const AppointmentsTab = () => {
  return (
    <div>
      <TabView>
        <TabPanel header="Requested">
          <Requested />
        </TabPanel>
        <TabPanel header="Scheduled">
          {/* TODO: Link Scheduled tab here */}
        </TabPanel>
        <TabPanel header="In Progress">
          {/* TODO: Link In Progress tab here */}
        </TabPanel>
        <TabPanel header="Completed">
          {/* TODO: Link Completed tab here */}
        </TabPanel>
      </TabView>
    </div>
  );
};

export default AppointmentsTab;
