import { TabPanel, TabView } from "primereact/tabview";
import Completed from "./completed";
import InProgress from "./inProgress";
import Requested from "./requested";
import Scheduled from "./scheduled";

const AppointmentsTab = () => {
  return (
    <div>
      <TabView>
        <TabPanel header="Requested">
          <Requested />
        </TabPanel>
        <TabPanel header="Scheduled">
          <Scheduled />
        </TabPanel>
        <TabPanel header="In Progress">
          <InProgress />
        </TabPanel>
        <TabPanel header="Completed">
          <Completed />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default AppointmentsTab;
