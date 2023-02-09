export const validateEmail = (email: string) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber: string) => {
  const phoneNumberRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return phoneNumberRegex.test(phoneNumber);
};

export const validatePostalCode = (postalCode: string) => {
  const phoneNumberRegex = /^[A-Z]\d[A-Z][ ]?\d[A-Z]\d$/i;
  return phoneNumberRegex.test(postalCode);
};
