export interface IEmployee {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  type: "SHOP_OWNER" | "EMPLOYEE";
  shop_id: string;
}
