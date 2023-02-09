export enum ServiceType {
  CANNED = "CANNED",
  CUSTOM = "CUSTOM",
  REWORK = "REWORK",
}

export enum PartCondition {
  NEW = "NEW",
  USED = "USED",
  NEW_OR_USED = "NEW OR USED",
}

export enum PartType {
  OEM = "OEM",
  AFTERMARKET = "AFTERMARKET",
  OEM_OR_AFTERMARKET = "OEM OR AFTERMARKET",
}

export const parts_condition_basic = [
  { label: "NEW", value: PartCondition.NEW },
  { label: "USED", value: PartCondition.USED },
];

export const parts_condition_custom = [
  { label: "NEW", value: PartCondition.NEW },
  { label: "USED", value: PartCondition.USED },
  { label: "NEW OR USED", value: PartCondition.NEW_OR_USED },
];

export const parts_type_basic = [
  { label: "OEM", value: PartType.OEM },
  { label: "AFTERMARKET", value: PartType.AFTERMARKET },
];

export const parts_type_custom = [
  { label: "OEM", value: PartType.OEM },
  { label: "AFTERMARKET", value: PartType.AFTERMARKET },
  { label: "OEM OR AFTERMARKET", value: PartType.OEM_OR_AFTERMARKET },
];

export interface IService {
  id: string;
  name: string;
  description: string;
  estimated_time: number;
  total_price: number;
  parts: IParts[];
  type: ServiceType;
  shop_id: string;
}

export interface IParts {
  quantity?: number;
  cost?: number;
  name?: string;
  condition: string;
  build: string;
}
