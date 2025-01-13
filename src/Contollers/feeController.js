import { config2 } from "../App/config.js";
import sql from "mssql";

const pool = new sql.ConnectionPool(config2);

export const getFees = (req, res) => {
  const { id } = req.params;
  if (id) {
    pool
      .connect()
      .then(() => {
        return pool.request().query(`SELECT * FROM fee WHERE ID = ${id}`);
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
        return pool.request().query("SELECT * FROM fee");
      })
      .then((result) => {
        return res.status(200).json(result.recordset);
      })
      .catch((err) => {
        return res.status(404).json({ message: "Error obteniendo los datos" });
      });
  }
};

export const registerFee = (req, res) => {
  const { taxidriver, amount, user, car, date } = req.body;

  const query = `INSERT INTO fee(delivered_by,amount,delivery_date,fee_date,received_by,car) VALUES(@valor1,@valor2, SYSDATETIMEOFFSET(),
              convert(DATETIME,@valor5),@valor3, @valor4);`;
  pool
    .connect()
    .then(() => {
      return pool
        .request()
        .input("valor1", sql.Int, taxidriver)
        .input("valor2", sql.Money, amount)
        .input("valor3", sql.VarChar, user)
        .input("valor4", sql.VarChar, car)
        .input("valor5", sql.VarChar, date)
        .query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Tarifa registrada" });
    })
    .catch((err) => {
      return res.status(404).json({ message: "Error registrando la tarifa" });
    });
};

export const updateFee = (req, res) => {
  const { taxidriver, amount, user, car,date } = req.body;
  const {id} = req.params;
  const query = `UPDATE fee SET delivered_by = @valor1, amount = @valor2, car = @valor4, fee_date = convert(DATETIME,@valor6),
   updated_at = SYSDATETIMEOFFSET(), updated_by = @valor3 WHERE ID = @valor5`;
  pool
    .connect()
    .then(() => {
      return pool
        .request()
        .input("valor1", sql.Int, taxidriver)
        .input("valor2", sql.Money, amount)
        .input("valor3", sql.VarChar, user)
        .input("valor4", sql.VarChar, car)
        .input("valor5", sql.Int, id)
        .input("valor6", sql.VarChar, date)
        .query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Tarifa actualizada" });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};
export const deleteFee = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM fee WHERE ID = @valor1`;
  pool
    .connect()
    .then(() => {
      return pool.request().input("valor1", sql.Int, id).query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Tarifa Eliminada" });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};
