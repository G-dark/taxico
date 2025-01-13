import { config2 } from "../App/config.js";
import sql from "mssql";

const pool = new sql.ConnectionPool(config2);

export const getCars = (req, res) => {
  const { id } = req.params;
  if (id) {
    pool
      .connect()
      .then(() => {
        return pool
          .request()
          .query(`SELECT * FROM car WHERE registration = ${id}`);
      })
      .then((result) => {
        return res.status(200).json(result.recordset);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  } else {
    pool
      .connect()
      .then(() => {
        return pool.request().query("SELECT * FROM car");
      })
      .then((result) => {
        return res.status(200).json(result.recordset);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  }
};

export const registerCar = (req, res) => {
  const { registration,model, driver } = req.body;
  const query = `INSERT INTO car(registration,modelo,_status,taxidriver) VALUES(@valor1,@valor2
              ,1, @valor4);`;
  pool
    .connect()
    .then(() => {
      return pool
        .request()
        .input("valor1", sql.VarChar, registration)
        .input("valor2", sql.Int, model)
        .input("valor4", sql.Int, driver)
        .query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Carro registrado" });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};

export const updateCar = (req, res) => {
  const { registration,model, status, driver, user }= req.body;
  const {id} = req.params;
  const query = `UPDATE car SET registration = @valor1 ,modelo = @valor2,_status = @valor3,taxidriver = @valor4,  
  updated_by = @valor6, updated_at = SYSDATETIMEOFFSET() WHERE registration= @valor5`;
  pool
    .connect()
    .then(() => {
      return pool
        .request()
        .input("valor1", sql.VarChar, registration)
        .input("valor2", sql.Int, model)
        .input("valor3", sql.Bit, status)
        .input("valor4", sql.Int, driver)
        .input("valor5", sql.VarChar, id)
        .input("valor6", sql.VarChar, user)
        .query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Carro actualizado" });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};
export const deleteCar = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM car WHERE registration = @valor1`;
  pool
    .connect()
    .then(() => {
      return pool.request().input("valor1", sql.VarChar, id).query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Carro eliminado" });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};
