import { config2 } from "../App/config.js";
import sql from "mssql";

const pool = new sql.ConnectionPool(config2);

export const getRepairs = (req, res) => {
  const { id } = req.params;
  if (id) {
    pool
      .connect()
      .then(() => {
        return pool.request().query(`SELECT * FROM repair WHERE ID = ${id}`);
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
        return pool.request().query("SELECT * FROM repair");
      })
      .then((result) => {
        return res.status(200).json(result.recordset);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  }
};

export const registerRepair = (req, res) => {
  const { concept, cost, car, user } = req.body;
  const query = `INSERT INTO repair(concept,cost,car,repair_date,registered_by) VALUES(@valor1,@valor2
              ,@valor3, SYSDATETIMEOFFSET(),@valor4);`;
  pool
    .connect()
    .then(() => {
      return pool
        .request()
        .input("valor1", sql.VarChar, concept)
        .input("valor2", sql.Money, cost)
        .input("valor3", sql.VarChar, car)
        .input("valor4", sql.VarChar, user)
        .query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Tarifa registrada" });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};

export const updateRepair = (req, res) => {
  const { concept, cost, car, user} = req.body;
  const {id} = req.params;
  const query = `UPDATE repair SET concept = @valor1 ,cost = @valor2,car = @valor3, updated_by = @valor4, updated_at= SYSDATETIMEOFFSET()
    WHERE ID = @valor5`;
  pool
    .connect()
    .then(() => {
      return pool
        .request()
        .input("valor1", sql.VarChar, concept)
        .input("valor2", sql.Money, cost)
        .input("valor3", sql.VarChar, car)
        .input("valor4", sql.VarChar, user)
        .input("valor5", sql.Int, id)
        .query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Tarifa actualizada" });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};
export const deleteRepair = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM repair WHERE ID = @valor1`;
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
