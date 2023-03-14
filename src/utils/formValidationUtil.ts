export const EMAIL_REGEX = new RegExp(
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

export const validateEmail = (email: string) => {
  return EMAIL_REGEX.test(email);
};

export const PHONE_NUMBER_REGEX = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  "im"
);

export const validatePhoneNumber = (phoneNumber: string) => {
  return PHONE_NUMBER_REGEX.test(phoneNumber);
};

export const POSTAL_CODE_REGEX = new RegExp(/^[A-Z]\d[A-Z][ ]?\d[A-Z]\d$/, "i");

export const validatePostalCode = (postalCode: string) => {
  return POSTAL_CODE_REGEX.test(postalCode);
};

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/
);

export const validatePassword = (password: string) => {
  return PASSWORD_REGEX.test(password);
};
