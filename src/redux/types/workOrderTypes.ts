enum WorkOrderTypes {
  READ_WORK_ORDER_BY_ID = "READ WORK ORDER BY ID", // Saga
  PATCH_WORK_ORDER_BY_ID = "PATCH WORK ORDER BY ID", // Saga
  SET_WORK_ORDER = "SET WORK ORDER", // Reducer
  SET_WORK_ORDER_ERROR = "SET WORK ORDER ERROR", // Reducer
}

export default WorkOrderTypes;
