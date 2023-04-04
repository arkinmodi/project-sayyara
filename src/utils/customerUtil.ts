import { ICustomer } from "src/types/customer";

/**
 * Get customer by customer ID
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 01/30/2023
 * @param {string} id - Customer ID
 * @returns A customer object
 */
export async function getCustomerById(id: string): Promise<ICustomer | null> {
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
      return null;
    }
  });
}
