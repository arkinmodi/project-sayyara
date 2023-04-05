import { EmployeeStatus, UserType } from "@prisma/client";
import { setEmployeeStatus } from "@redux/actions/employeeActions";
import { readShopEmployees } from "@redux/actions/shopActions";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import { ShopSelectors } from "@redux/selectors/shopSelector";
import styles from "@styles/components/employees/EmployeeTable.module.css";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableFilterMeta,
  DataTableFilterMetaData,
} from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShopRoles } from "src/types/auth";
import { IEmployee } from "src/types/employee";

/**
 * Creates and handles the table of employees of a shop
 * Found in "Manage Shop" > "Employees"
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @date 02/04/2023
 * @returns A primereact table component
 */
const EmployeeTable = () => {
  const [employeeList, setEmployeeList] = useState<IEmployee[]>([]);
  const [showSuspendEmployeeDialog, setShowSuspendEmployeeDialog] =
    useState(false);
  const [employeeToSuspend, setEmployeeToSuspend] = useState<IEmployee | null>(
    null
  );
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    firstName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    lastName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    id: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    phoneNumber: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    type: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const employees = useSelector(ShopSelectors.getShopEmployees);
  const userType = useSelector(AuthSelectors.getUserType);
  const shopId = useSelector(AuthSelectors.getShopId);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(readShopEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (employees) {
      const activeEmployees = employees.filter(
        (employee) => employee.status === EmployeeStatus.ACTIVE
      );
      setEmployeeList(activeEmployees);
    }
  }, [employees]);

  const handleSuspendEmployeeButton = (employee: IEmployee) => {
    setShowSuspendEmployeeDialog(true);
    setEmployeeToSuspend(employee);
  };

  const suspendEmployee = () => {
    if (employeeToSuspend) {
      dispatch(
        setEmployeeStatus({
          employeeId: employeeToSuspend.id,
          status: EmployeeStatus.SUSPENDED,
        })
      );
    }
    setShowSuspendEmployeeDialog(false);
  };

  const suspendEmployeeButton = (employee: IEmployee) => {
    return (
      <React.Fragment>
        {/**
         * Hide suspend option for shop owner
         */}
        {employee.type === ShopRoles.EMPLOYEE ? (
          <Button
            icon="pi pi-trash"
            className="p-button-text p-button-danger p-button-rounded"
            // call the delete saga pass in the id
            onClick={() => handleSuspendEmployeeButton(employee)}
          />
        ) : (
          <></>
        )}
      </React.Fragment>
    );
  };

  const hideSuspendEmployeeDialog = () => {
    setShowSuspendEmployeeDialog(false);
  };

  const handleGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let updatedFilters = { ...filters };
    if (updatedFilters["global"]) {
      (updatedFilters["global"] as DataTableFilterMetaData).value = value;

      setFilters(updatedFilters);
      setGlobalFilterValue(value);
    }
  };

  const renderTableHeader = () => {
    return (
      <div className={styles.employeeTableHeader}>
        <h2>Employees</h2>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={handleGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const suspendEmployeeDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideSuspendEmployeeDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={suspendEmployee}
      />
    </React.Fragment>
  );

  return (
    <div className={styles.employeeTableContainer}>
      <Message
        className={styles.inviteEmployeeMessage}
        style={{
          display: userType === UserType.SHOP_OWNER ? "inline-flex" : "none",
        }}
        severity="info"
        text={`To invite an employee, please provide them with your shop ID: ${shopId}`}
      />
      <DataTable
        className={styles.employeeTable}
        header={renderTableHeader()}
        value={employeeList}
        showGridlines
        stripedRows
        responsiveLayout="scroll"
        emptyMessage="No employees found."
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "id",
          "name",
          "firstName",
          "lastName",
          "type",
          "phoneNumber",
        ]}
      >
        <Column field="id" header="ID" sortable></Column>
        <Column field="firstName" header="First Name" sortable></Column>
        <Column field="lastName" header="Last Name" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="phoneNumber" header="Phone Number"></Column>
        <Column field="type" header="Role" sortable></Column>
        <Column
          body={(data) => suspendEmployeeButton(data)}
          className={styles.suspendEmployeeButtonColumn}
          style={{
            display:
              userType === UserType.SHOP_OWNER && employeeList.length > 1
                ? "table-cell"
                : "none",
          }}
        ></Column>
      </DataTable>
      <Dialog
        visible={showSuspendEmployeeDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={suspendEmployeeDialogFooter}
        onHide={hideSuspendEmployeeDialog}
      >
        <div className="confirmation-content">
          {employeeToSuspend && (
            <div>
              Are you sure you want to suspend{" "}
              <b>
                {employeeToSuspend.firstName} {employeeToSuspend.lastName}
              </b>
              ?
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default React.memo(EmployeeTable);
