import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const SUCCESS_MESSAGE_REGISTER = "user registrado correctamente";
const SUCCESS_MESSAGE_LOGIN = "user logueado correctamente";
const ERROR_MESSAGE = "Hubo un error al registrar al user";

export const register = async (req, res) => {
  const { name, lastname, email, password, role } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      lastname,
      email,
      password: passwordHash,
      role,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token);

    res.status(201).json({
      message: SUCCESS_MESSAGE_REGISTER,
      id: userSaved._id,
      name: userSaved.name,
      lastname: userSaved.lastname,
      email: userSaved.email,
    });
  } catch (error) {
    console.error("Error al registrar al user:", error);
    res.status(500).json({ message: ERROR_MESSAGE, error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFinded = await User.findOne({ email });

    if (!userFinded)
      return res.status(400).json({ messsage: "User not found" });

    const isMatch = await bcrypt.compare(password, userFinded.password);

    if (!isMatch)
      return res.status(400).json({ message: "Credencial inválida" });

    const token = await createAccessToken({ id: userFinded._id });
    res.cookie("token", token);

    res.status(201).json({
      message: SUCCESS_MESSAGE_LOGIN,
      user: userFinded,
    });
  } catch (error) {
    console.error("Error al loguearse:", error);
    res.status(500).json({ message: ERROR_MESSAGE, error: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userId = req.user.id;
  const userFinded = await User.findById(userId);

  if (!userFinded)
    return res.status(400).json({ message: "User no encontrado" });

  return res.json({
    id: userFinded._id,
    name: userFinded.name,
    email: userFinded.email,
  });
};
