export const EMAIL_REGEX = new RegExp(
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

/**
 * Validates email to match with the email regex
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 03/13/2023
 * @param {string} email - Email
 * @returns Boolean value representing if email matches the regex
 */
export const validateEmail = (email: string) => {
  return EMAIL_REGEX.test(email);
};

export const PHONE_NUMBER_REGEX = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  "im"
);

/**
 * Validates phone number to match phone number regex
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 03/13/2023
 * @param {string} phoneNumber - Phone number
 * @returns Boolean value representing if phone number matches the regex
 */
export const validatePhoneNumber = (phoneNumber: string) => {
  return PHONE_NUMBER_REGEX.test(phoneNumber);
};

export const POSTAL_CODE_REGEX = new RegExp(/^[A-Z]\d[A-Z][ ]?\d[A-Z]\d$/, "i");

/**
 * Validates postal code to match postal code regex
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 03/13/2023
 * @param {string} postalCode - Postal code
 * @returns Boolean value representing if postal code matches the regex
 */
export const validatePostalCode = (postalCode: string) => {
  return POSTAL_CODE_REGEX.test(postalCode);
};

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/
);

/**
 * Validates password to match password requirements, using regex
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 03/13/2023
 * @param {string} password - Password
 * @returns Boolean value representing if password matches the regex
 */
export const validatePassword = (password: string) => {
  return PASSWORD_REGEX.test(password);
};
