import styles from "@styles/pages/appointments/ShopAppointments.module.css";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import { AppointmentStatus } from "../../../types/appointment";
import ShopAppointments from "./shopAppointments";

const AppointmentsTab = () => {
  return (
    <div>
      <div className={styles.desktop}>
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

      <div className={styles.mobile}>
        <TabView>
          <TabPanel header={<i className="pi pi-inbox"></i>}>
            <ShopAppointments
              appointmentTab={AppointmentStatus.PENDING_APPROVAL}
            />
          </TabPanel>
          <TabPanel header={<i className="pi pi-calendar"></i>}>
            <ShopAppointments appointmentTab={AppointmentStatus.ACCEPTED} />
          </TabPanel>
          <TabPanel header={<i className="pi pi-clock"></i>}>
            <ShopAppointments appointmentTab={AppointmentStatus.IN_PROGRESS} />
          </TabPanel>
          <TabPanel header={<i className="pi pi-check-circle"></i>}>
            <ShopAppointments appointmentTab={AppointmentStatus.COMPLETED} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default React.memo(AppointmentsTab);
