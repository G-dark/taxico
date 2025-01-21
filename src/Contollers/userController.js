import sql from "mssql";
import bcrypt from "bcryptjs";
import { Validation } from "../Utils/validation.js";
import { config2, SALT_OR_ROUNDS, SECRET_KEY } from "../App/config.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const pool = new sql.ConnectionPool(config2);

export const registUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    Validation.validateUsername(username);
    Validation.validatePassword(password);
    const hashedpw = await bcrypt.hash(password, SALT_OR_ROUNDS);

    const query = `INSERT INTO _user(username,_password) VALUES(@valor1,@valor2)`;

    pool
      .connect()
      .then(() => {
        return pool
          .request()
          .input("valor1", sql.VarChar, username)
          .input("valor2", sql.VarChar, hashedpw)
          .query(query);
      })
      .then((result) => {
        return res.status(200).json({ message: "Usuario registrado" });
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export const logUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    Validation.validateUsername(username);
    Validation.validatePassword(password);

    const token = jwt.sign({ id: username, username: username }, SECRET_KEY, {
      expiresIn: "1h",
    });
    const query = `SELECT * FROM _user where username ='${username}'`;

    pool
      .connect()
      .then(() => {
        return pool.request().query(query);
      })
      .then(async (result) => {
        const _password = result.recordset[0]._password;
        let log = false;
          log = await bcrypt.compare(password, _password);

        return res
          .status(200)
          .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.ENV === "production",
            sameSite: "None",
            maxAge: 1000 * 60 * 60,
          })
          .send(log);
      })
      .catch((err) => {
        return res.status(404).json({message:err});
      });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  const { username, password } = req.body;

  try {
    Validation.validateUsername(username);
    Validation.validatePassword(password);

    const token = jwt.sign({ id: username, username: username }, SECRET_KEY, {
      expiresIn: "7d",
    });
    const query = `SELECT * FROM _user where username ='${username}'`;

    pool
      .connect()
      .then(() => {
        return pool.request().query(query);
      })
      .then(async (result) => {
        const _password = result.recordset[0]._password;
        let log = false;
          log = await bcrypt.compare(password, _password);

        return res
          .status(200)
          .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.ENV === "production",
            sameSite: "None",
            maxAge: 1000 * 60 * 60,
          })
          .send(log);
      })
      .catch((err) => {
        return res.status(404).json({message:"Error en el inicio de sesion"});
      });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};
