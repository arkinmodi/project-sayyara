import { TabPanel, TabView } from "primereact/tabview";
import { AppointmentStatus } from "../../../types/appointment";
import ShopAppointments from "./shopAppointments";

const AppointmentsTab = () => {
  return (
    <div>
      <TabView>
        <TabPanel header="Requested">
          <ShopAppointments
            appointmentTab={AppointmentStatus.PENDING_APPROVAL}
          />
        </TabPanel>
        <TabPanel header="Scheduled">
          <ShopAppointments appointmentTab={AppointmentStatus.ACCEPTED} />
        </TabPanel>
        <TabPanel header="In Progress">
          <ShopAppointments appointmentTab={AppointmentStatus.IN_PROGRESS} />
        </TabPanel>
        <TabPanel header="Completed">
          <ShopAppointments appointmentTab={AppointmentStatus.COMPLETED} />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default AppointmentsTab;
