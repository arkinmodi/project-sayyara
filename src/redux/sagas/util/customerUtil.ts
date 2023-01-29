import { ICustomer } from "src/types/customer";

export function getCustomerById(id: string): Promise<ICustomer | null> {
  return fetch(`/api/customer/` + id, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const Customer: ICustomer = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          email: data.email,
        };
        return Customer;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}
