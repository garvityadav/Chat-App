import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const saltRound = process.env.SALTROUND || 10;

export const savePassword = async (password: string) => {
  try {
    const hashPassword = await bcrypt.hash(password, saltRound);
    return hashPassword;
  } catch (error) {
    throw error;
  }
};

export const verifyPassword = async (
  userPassword: string,
  dbPassword: string
) => {
  try {
    const match = await bcrypt.compare(userPassword, dbPassword);
    if (match) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};
