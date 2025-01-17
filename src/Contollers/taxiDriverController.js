import { config2 } from "../App/config.js";
import sql from "mssql";

const pool = new sql.ConnectionPool(config2);

export const getDrivers = (req, res) => {
  const { id } = req.params;
  if (id) {
    pool
      .connect()
      .then(() => {
        return pool
          .request()
          .query(`SELECT * FROM taxiDrivers WHERE ID = ${id}`);
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
        return pool.request().query("SELECT * FROM taxiDrivers");
      })
      .then((result) => {
        return res.status(200).json(result.recordset);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  }
};

export const registerDriver = (req, res) => {
  const { fn, sn, ln, alias, ID, car,user } = req.body;
  const query = `INSERT INTO taxiDrivers(firstname,secondname,lastname,alias,ID,car,_status,registered_by,registered_at,deficit) VALUES(@valor1,@valor2
              ,@valor3, @valor4,@valor5,@valor6,1,@valor7,SYSDATETIMEOFFSET(),0);`;
  pool
    .connect()
    .then(() => {
      return pool
        .request()
        .input("valor1", sql.VarChar, fn)
        .input("valor2", sql.VarChar, sn)
        .input("valor3", sql.VarChar, ln)
        .input("valor4", sql.VarChar, alias)
        .input("valor5", sql.Int, ID)
        .input("valor6", sql.VarChar, car)
        .input("valor7", sql.VarChar, user)
        .query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Tarifa registrada" });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};

export const updateDriver = (req, res) => {
  const { fn, sn, ln, alias, ID, car, status,deficit }= req.body;
  const {id} = req.params;
  const query = `UPDATE taxiDrivers SET firstname = @valor1 ,secondname = @valor2,lastname = @valor3,alias = @valor4, 
  ID = @valor5, car = @valor6, _status= @valor8, deficit= @valor9 WHERE ID = @valor7`;
  pool
    .connect()
    .then(() => {
      return pool
        .request()
        .input("valor1", sql.VarChar, fn)
        .input("valor2", sql.VarChar, sn)
        .input("valor3", sql.VarChar, ln)
        .input("valor4", sql.VarChar, alias)
        .input("valor5", sql.Int, ID)
        .input("valor6", sql.VarChar, car)
        .input("valor7",sql.Int,id)
        .input("valor8",sql.Bit, status)
        .input("valor9",sql.Money, deficit)
        .query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Conductor actualizado" });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};
export const deleteDriver = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM taxiDrivers WHERE ID = @valor1`;
  pool
    .connect()
    .then(() => {
      return pool.request().input("valor1", sql.Int, id).query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Conductor Eliminado" });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
};
