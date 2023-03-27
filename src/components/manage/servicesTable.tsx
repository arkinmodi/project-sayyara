import { UserType } from "@prisma/client";
import { setService } from "@redux/actions/serviceAction";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/pages/services/Services.module.css";
import { Button } from "primereact/button";
import {
  Column,
  ColumnBodyOptions,
  ColumnEditorOptions,
} from "primereact/column";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableRowEditCompleteParams,
} from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import {
  InputNumber,
  InputNumberValueChangeParams,
} from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IService,
  partsConditionBasic,
  partsConditionCustom,
  partsTypeBasic,
  partsTypeCustom,
  ServiceType,
} from "src/types/service";
import { deleteServiceById } from "src/utils/serviceUtil";
import AddPartPopup from "./addPartPopup";
import AddServicePopup from "./addServicePopup";

interface IServiceProps {
  serviceType: ServiceType;
  services: IService[];
  isLoading: boolean;
}

const ServicesTable = (props: IServiceProps) => {
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | undefined
  >(undefined);
  const [addServiceDialogVisible, setAddServiceDialogVisible] = useState(false);
  const [addPartDialogVisible, setAddPartDialogVisible] = useState(false);
  const [serviceOnButtonClick, setServiceOnButtonClick] =
    useState<IService | null>(null);

  const toastRef = useRef<Toast>(null);

  const { serviceType, services, isLoading } = props;
  const userType = useSelector(AuthSelectors.getUserType);

  const dispatch = useDispatch();

  const hideAddServiceDialog = () => {
    setAddServiceDialogVisible(false);
  };

  const hideAddPartDialog = () => {
    setAddPartDialogVisible(false);
    setServiceOnButtonClick(null);
  };

  const displayColForCannedOnly =
    serviceType === ServiceType.CANNED ? "table-cell" : "none";

  const displayColForCustomOnly =
    serviceType === ServiceType.CUSTOM ? "table-cell" : "none";

  const displayColForShopOwnerOnly =
    userType === UserType.SHOP_OWNER ? "table-cell" : "none";

  const serviceTableHeader = () => {
    return (
      <div className={styles.servicesTableHeader}>
        <h2 className="mx-0 my-1">
          {serviceType === ServiceType.CANNED
            ? "Basic Services"
            : "Custom Services"}
        </h2>
        {userType === UserType.SHOP_OWNER ? (
          <Button
            label={
              serviceType === ServiceType.CANNED
                ? "Add Basic Service"
                : "Add Custom Service"
            }
            icon="pi pi-plus"
            className={styles.addServiceButtonGreen}
            onClick={() => {
              setAddServiceDialogVisible(true);
            }}
          />
        ) : (
          <></>
        )}
      </div>
    );
  };

  const partsTableHeader = (serviceData: IService) => {
    return (
      <div className={styles.servicesTableHeader}>
        <h2>Parts</h2>
        {userType === UserType.SHOP_OWNER ? (
          <Button
            label={"Add Part"}
            icon="pi pi-plus"
            className={styles.addServiceButtonGreen}
            onClick={() => {
              setServiceOnButtonClick(serviceData);
              setAddPartDialogVisible(true);
            }}
          />
        ) : (
          <></>
        )}
      </div>
    );
  };

  const rowExpansionPartsTable = (serviceData: IService) => {
    const parts = serviceData.parts;
    return (
      <div className={styles.partsTable}>
        <DataTable
          value={parts}
          header={partsTableHeader(serviceData)}
          responsiveLayout="scroll"
          paginator
          showGridlines
          stripedRows
          rows={5}
          size="small"
          dataKey="name"
          editMode="row"
          onRowEditComplete={(params) => {
            onPartsRowEditComplete(params, serviceData);
          }}
        >
          <Column
            field="name"
            header="Name"
            editor={(options) => textEditor(options)}
            sortable
          ></Column>
          <Column
            field="quantity"
            header="Quantity"
            editor={(options) => quantityEditor(options)}
            sortable
          ></Column>
          <Column
            field="cost"
            header="Cost Per Unit (CA$)"
            editor={(options) => priceEditor(options)}
            sortable
          ></Column>
          <Column
            field="condition"
            header="Condition"
            editor={(options) => partsConditionEditor(options)}
          ></Column>
          <Column
            field="build"
            header="Type"
            editor={(options) => partsTypeEditor(options)}
          ></Column>
          <Column
            rowEditor
            headerStyle={{ minWidth: "4rem" }}
            bodyStyle={{ textAlign: "center" }}
            style={{
              display: displayColForShopOwnerOnly,
            }}
          ></Column>
          <Column
            body={(props) => (
              <div>
                <Button
                  icon="pi pi-trash"
                  className="p-button-text p-button-danger p-button-rounded"
                  onClick={() => handleDeletePartButton(props, serviceData)}
                />
              </div>
            )}
            className={styles.servicesTableDeleteButton}
            style={{
              display: displayColForShopOwnerOnly,
            }}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const partsCondition = (serviceData: IService) => {
    const parts = serviceData.parts;
    return <div>{parts[0]?.condition}</div>;
  };

  const partsType = (serviceData: IService) => {
    const parts = serviceData.parts;
    return <div>{parts[0]?.build}</div>;
  };

  const onPartsRowEditComplete = (
    params: DataTableRowEditCompleteParams,
    serviceData: IService
  ) => {
    let { newData, index } = params;

    let newParts = [...serviceData.parts];
    newParts[index] = newData;

    dispatch(
      setService({
        serviceId: serviceData.id,
        patch: {
          parts: newParts,
        },
      })
    );
  };

  const partsConditionEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={
          serviceType === ServiceType.CANNED
            ? partsConditionBasic
            : partsConditionCustom
        }
        optionLabel="label"
        optionValue="value"
        onChange={(e) => {
          if (options.editorCallback) options.editorCallback(e.value);
        }}
        placeholder={
          serviceType === ServiceType.CUSTOM
            ? options.rowData.parts[0].condition
            : options.rowData.condition
        }
        itemTemplate={(option) => {
          return <div>{option.label}</div>;
        }}
      />
    );
  };

  const partsTypeEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={
          serviceType === ServiceType.CANNED ? partsTypeBasic : partsTypeCustom
        }
        optionLabel="label"
        optionValue="value"
        onChange={(e) => {
          if (options.editorCallback) options.editorCallback(e.value);
        }}
        placeholder={
          serviceType === ServiceType.CUSTOM
            ? options.rowData.parts[0].build
            : options.rowData.build
        }
        itemTemplate={(option) => {
          return <div>{option.label}</div>;
        }}
      />
    );
  };

  const priceEditor = (options: ColumnEditorOptions) => {
    return (
      <InputNumber
        value={options.value}
        min={0}
        onValueChange={(e: InputNumberValueChangeParams) => {
          if (options.editorCallback) options.editorCallback(e.value);
        }}
        mode="currency"
        currency="CAD"
      />
    );
  };

  const textEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => {
          if (options.editorCallback) options.editorCallback(e.target.value);
        }}
      />
    );
  };

  const quantityEditor = (options: ColumnEditorOptions) => {
    return (
      <InputNumber
        min={0}
        value={options.value}
        onValueChange={(e: InputNumberValueChangeParams) => {
          if (options.editorCallback) options.editorCallback(e.value);
        }}
      />
    );
  };

  const estimatedTimeEditor = (options: ColumnEditorOptions) => {
    return (
      <InputNumber
        min={0}
        maxFractionDigits={1}
        value={options.value}
        onValueChange={(e: InputNumberValueChangeParams) => {
          if (options.editorCallback) options.editorCallback(e.value);
        }}
      />
    );
  };

  const onServiceRowEditComplete = (e: DataTableRowEditCompleteParams) => {
    let { newData } = e;

    if (serviceType === ServiceType.CUSTOM) {
      let newParts = [...newData.parts];

      if (newData.field_5 && newData.field_6) {
        newParts[0] = {
          condition: newData.field_5,
          build: newData.field_6,
        };
      } else if (newData.field_5) {
        newParts[0] = {
          condition: newData.field_5,
          build: newData.parts[0].type,
        };
      } else if (newData.field_6) {
        newParts[0] = {
          condition: newData.parts[0].condition,
          build: newData.field_6,
        };
      }

      dispatch(
        setService({
          serviceId: newData.id,
          patch: {
            name: newData.name,
            description: newData.description,
            estimatedTime: 0,
            totalPrice: 0,
            parts: newParts,
          },
        })
      );
    } else {
      dispatch(
        setService({
          serviceId: newData.id,
          patch: {
            name: newData.name,
            description: newData.description,
            estimatedTime: newData.estimatedTime,
            totalPrice: newData.totalPrice,
            parts: newData.parts,
          },
        })
      );
    }
  };

  const deleteButton = (service: IService) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-danger p-button-rounded"
          onClick={() => handleDeleteServiceButton(service)}
        />
      </React.Fragment>
    );
  };

  const handleDeleteServiceButton = (service: IService) => {
    deleteServiceEvent(service.id);
  };

  const deleteServiceEvent = async (serviceId: string) => {
    if (typeof serviceId === "string") {
      await deleteServiceById(serviceId).then((res) => {
        if (!res) {
          showErrorToast(
            "Service could not be deleted due to having an active appointment for the service."
          );
        }
      });
    } else {
      showErrorToast("Service could not be deleted.");
    }
  };

  const showErrorToast = (msg: string) => {
    if (toastRef.current) {
      toastRef.current.show({
        sticky: true,
        severity: "error",
        summary: "Error",
        detail: msg,
      });
    }
  };

  const handleDeletePartButton = (
    props: ColumnBodyOptions,
    serviceData: IService
  ) => {
    let newParts = [...serviceData.parts];
    newParts.splice(props.rowIndex, 1);
    dispatch(
      setService({ serviceId: serviceData.id, patch: { parts: newParts } })
    );
  };

  return (
    <div className={styles.serviceServicesContainer}>
      <DataTable
        value={services}
        paginator
        showGridlines
        stripedRows
        rows={10}
        dataKey="id"
        size="small"
        filterDisplay="menu"
        loading={isLoading}
        responsiveLayout="scroll"
        globalFilterFields={["name"]}
        header={serviceTableHeader}
        rowExpansionTemplate={(data) => rowExpansionPartsTable(data)}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
        emptyMessage="No services found."
        editMode="row"
        onRowEditComplete={onServiceRowEditComplete}
      >
        <Column
          expander={true}
          style={{
            display: displayColForCannedOnly,
          }}
        />
        <Column
          field="name"
          header="Service Name"
          filter
          sortable
          filterPlaceholder="Search"
          style={{ minWidth: "4rem" }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="description"
          header="Description"
          style={{ minWidth: "8rem" }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="estimatedTime"
          header="Duration (Hours)"
          editor={(options) => estimatedTimeEditor(options)}
          style={{
            display: displayColForCannedOnly,
          }}
        />
        <Column
          field="totalPrice"
          header="Estimated Cost (CA$)"
          editor={(options) => priceEditor(options)}
          sortable
          style={{
            display: displayColForCannedOnly,
          }}
        />
        <Column
          header="Part Condition"
          body={(data) => partsCondition(data)}
          editor={(options) => partsConditionEditor(options)}
          style={{
            display: displayColForCustomOnly,
          }}
        />
        <Column
          header="Part Type"
          body={(data) => partsType(data)}
          editor={(options) => partsTypeEditor(options)}
          style={{
            display: displayColForCustomOnly,
          }}
        />
        <Column
          rowEditor
          headerStyle={{ minWidth: "4rem" }}
          bodyStyle={{ textAlign: "center" }}
          style={{
            display: displayColForShopOwnerOnly,
          }}
        ></Column>
        <Column
          body={deleteButton}
          className={styles.servicesTableDeleteButton}
          style={{
            display: displayColForShopOwnerOnly,
          }}
        ></Column>
      </DataTable>
      <AddServicePopup
        serviceType={serviceType}
        visible={addServiceDialogVisible}
        onHideDialog={hideAddServiceDialog}
      />
      {serviceOnButtonClick != null ? (
        <AddPartPopup
          visible={addPartDialogVisible}
          onHideDialog={hideAddPartDialog}
          service={serviceOnButtonClick}
        />
      ) : (
        <></>
      )}
      <Toast ref={toastRef} position="top-right" />
    </div>
  );
};

export default React.memo(ServicesTable);
