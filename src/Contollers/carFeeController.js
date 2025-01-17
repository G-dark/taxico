import { config2 } from "../App/config.js";
import sql from "mssql";

const pool = new sql.ConnectionPool(config2);

export const getCarFees = (req, res) => {
  const { id } = req.params;
  if (id) {
    pool
      .connect()
      .then(() => {
        return pool
          .request()
          .query(`SELECT * FROM car_fee WHERE car = ${id}`);
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
        return pool.request().query("SELECT * FROM car_fee");
      })
      .then((result) => {
        return res.status(200).json(result.recordset);
      })
      .catch((err) => {
        return res.status(404).json({message:"Error obteniendo los datos"});
      });
  }
};

export const registerCarFee = (req, res) => {
  const { gain,maintenance, car,residuo }= req.body;
  const query = `INSERT INTO car_fee(gain,maintenance,car,carFee_date,residuo) VALUES(@valor1,@valor2
              ,@valor3,SYSDATETIMEOFFSET(),@valor4);`;
  pool
    .connect()
    .then(() => {
      return pool
        .request()
        .input("valor1", sql.Money, gain)
        .input("valor2", sql.Money, maintenance)
        .input("valor3", sql.VarChar, car)
        .input("valor4", sql.Money, residuo)
        .query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Registrado" });
    })
    .catch((err) => {
      return res.status(404).json({message:"Error Registrando"});
    });
};

export const updateCarFee = (req, res) => {
  const { gain,maintenance, car, residuo }= req.body;
  const {id} = req.params;
  const query = `UPDATE car_fee SET  gain= @valor1 ,maintenance = @valor2,car = @valor3, carFee_date = SYSDATETIMEOFFSET(),residuo = @valor5
   WHERE car= @valor4`;
  pool
    .connect()
    .then(() => {
      return pool
        .request()
        .input("valor1", sql.Money, gain)
        .input("valor2", sql.Money, maintenance)
        .input("valor3", sql.VarChar, car)
        .input("valor4", sql.VarChar, id)
        .input("valor5", sql.Money, residuo)
        .query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Actualizado" });
    })
    .catch((err) => {
      return res.status(404).json({message:"Error Actualizando"});
    });
};
export const deleteCarFee = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM car_fee WHERE car = @valor1`;
  pool
    .connect()
    .then(() => {
      return pool.request().input("valor1", sql.VarChar, id).query(query);
    })
    .then((result) => {
      return res.status(200).json({ message: "Informacion del carro eliminado" });
    })
    .catch((err) => {
      return res.status(404).json({message:"Error Eliminando"});
    });
};
