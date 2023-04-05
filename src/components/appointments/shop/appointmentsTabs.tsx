import styles from "@styles/pages/appointments/ShopAppointments.module.css";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import { AppointmentStatus } from "../../../types/appointment";
import ShopAppointments from "./shopAppointments";

interface IAppointmentTabsProps {
  toggleActiveTab: () => void;
}

/**
 * Renders the tabs that separate the appointments by their status
 * Tab headers are: Requested, Scheduled, In Progress, Completed, Cancelled
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 03/05/2023
 * @param {IAppointmentTabsProps} props - Appointment tabs props
 * @returns
 */
const AppointmentsTab = (props: IAppointmentTabsProps) => {
  const { toggleActiveTab } = props;
  return (
    <div>
      <div className={styles.desktop}>
        <TabView>
          <TabPanel header="Requested">
            <ShopAppointments
              appointmentTab={AppointmentStatus.PENDING_APPROVAL}
              toggleActiveTab={toggleActiveTab}
            />
          </TabPanel>
          <TabPanel header="Scheduled">
            <ShopAppointments
              appointmentTab={AppointmentStatus.ACCEPTED}
              toggleActiveTab={toggleActiveTab}
            />
          </TabPanel>
          <TabPanel header="In Progress">
            <ShopAppointments
              appointmentTab={AppointmentStatus.IN_PROGRESS}
              toggleActiveTab={toggleActiveTab}
            />
          </TabPanel>
          <TabPanel header="Completed">
            <ShopAppointments
              appointmentTab={AppointmentStatus.COMPLETED}
              toggleActiveTab={toggleActiveTab}
            />
          </TabPanel>
          <TabPanel header="Cancelled">
            <ShopAppointments
              appointmentTab={AppointmentStatus.CANCELLED}
              toggleActiveTab={toggleActiveTab}
            />
          </TabPanel>
        </TabView>
      </div>

      <div className={styles.mobile}>
        <TabView>
          <TabPanel header={<i className="pi pi-inbox"></i>}>
            <ShopAppointments
              appointmentTab={AppointmentStatus.PENDING_APPROVAL}
              toggleActiveTab={toggleActiveTab}
            />
          </TabPanel>
          <TabPanel header={<i className="pi pi-calendar"></i>}>
            <ShopAppointments
              appointmentTab={AppointmentStatus.ACCEPTED}
              toggleActiveTab={toggleActiveTab}
            />
          </TabPanel>
          <TabPanel header={<i className="pi pi-clock"></i>}>
            <ShopAppointments
              appointmentTab={AppointmentStatus.IN_PROGRESS}
              toggleActiveTab={toggleActiveTab}
            />
          </TabPanel>
          <TabPanel header={<i className="pi pi-check-circle"></i>}>
            <ShopAppointments
              appointmentTab={AppointmentStatus.COMPLETED}
              toggleActiveTab={toggleActiveTab}
            />
          </TabPanel>
          <TabPanel header={<i className="pi pi-times-circle"></i>}>
            <ShopAppointments
              appointmentTab={AppointmentStatus.CANCELLED}
              toggleActiveTab={toggleActiveTab}
            />
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default React.memo(AppointmentsTab);
