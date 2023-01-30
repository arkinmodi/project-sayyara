export enum ServiceType {
  CANNED = "CANNED",
  CUSTOM = "CUSTOM",
  REWORK = "REWORK",
}

export interface IService {
  id: string;
  name: string;
  description: string;
  estimated_time: number;
  total_price: string;
  parts: string;
  type: ServiceType;
  shop_id: string;
}
