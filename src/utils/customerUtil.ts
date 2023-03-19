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
        const customer: ICustomer = {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          email: data.email,
        };
        return customer;
      });
    } else {
      // TODO: check and handle errors
      return null;
    }
  });
}
