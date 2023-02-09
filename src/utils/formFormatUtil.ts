// Format phone number input to (###) ###-####
export const formatPhoneNumber = (phoneNumber: string) => {
  // If input is empty (e.g., user deletes the phone number)
  if (!phoneNumber) return phoneNumber;

  // Remove any non-digit characters (restrict user to only entering digits)
  phoneNumber = phoneNumber.replace(/[^\d]/g, "");

  // Only apply formatting when the phone number is greater than just area code (i.e., more than 3 digits)
  if (phoneNumber.length <= 3) {
    return phoneNumber;
  }

  // Formatting for 4-6 digits entered
  if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  // Formatting for 7-10 digits entered
  // Restrict input to 7 digits only (if user enters more, we will remove it)
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
};

export const formatName = (name: string) => {
  // Restrict input to only characters
  var formattedName = name.replace(/[0-9]/g, "");
  formattedName =
    formattedName.charAt(0).toUpperCase() +
    formattedName.slice(1).toLowerCase();
  return formattedName;
};

// Format postal code input to A#A #A#
export const formatPostalCode = (postalCode: string) => {
  // If input is empty (e.g., user deletes the postal code)
  if (!postalCode) {
    return postalCode;
  }

  // Remove spaces and to uppercase for processing
  postalCode = postalCode.replace(/ /g, "").toUpperCase();

  // Only apply formatting when the number of characters entered is greater than 3
  if (postalCode.length <= 3) {
    return postalCode;
  }

  // Formatting for more than 4 characters entered; restrict to 6 character input
  return `${postalCode.slice(0, 3)} ${postalCode.slice(3, 6)}`;
};
