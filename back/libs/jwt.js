import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const createAccessToken = async (payload) => {
  try {
    return jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" });
  } catch (error) {
    throw new Error("Error al crear el token de acceso: " + error.message);
  }
};
