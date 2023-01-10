import styles from "@styles/pages/appointments/Requests.module.css";
import { NextPage } from "next";
import { TabPanel, TabView } from "primereact/tabview";
import Requested from "./requested";

// TODO: tab structure for shop dashboard
const AppointmentsTab: NextPage = () => {
  return (
    <div className={styles.appointmentRequestsContainer}>
      <TabView>
        <TabPanel header="Quotes">{/* TODO: Link Quotes tab here */}</TabPanel>
        <TabPanel header="Service Requests">
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
        </TabPanel>
      </TabView>
    </div>
  );
};

export default AppointmentsTab;
