var bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(1);

export const hashPassword = (plaintext: string) =>
  bcrypt.hashSync(plaintext, salt);
