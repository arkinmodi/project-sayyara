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

export const partsConditionBasic = [
  { label: "NEW", value: PartCondition.NEW },
  { label: "USED", value: PartCondition.USED },
];

export const partsConditionCustom = [
  { label: "NEW", value: PartCondition.NEW },
  { label: "USED", value: PartCondition.USED },
  { label: "NEW OR USED", value: PartCondition.NEW_OR_USED },
];

export const partsTypeBasic = [
  { label: "OEM", value: PartType.OEM },
  { label: "AFTERMARKET", value: PartType.AFTERMARKET },
];

export const partsTypeCustom = [
  { label: "OEM", value: PartType.OEM },
  { label: "AFTERMARKET", value: PartType.AFTERMARKET },
  { label: "OEM OR AFTERMARKET", value: PartType.OEM_OR_AFTERMARKET },
];

export interface IService {
  id: string;
  name: string;
  description: string;
  estimatedTime: number;
  totalPrice: number;
  parts: IParts[];
  type: ServiceType;
  shopId: string;
}

export interface IParts {
  quantity?: number;
  cost?: number;
  name?: string;
  condition: string;
  build: string;
}
