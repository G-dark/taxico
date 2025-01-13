import express from "express";
import cors from "cors";
import fee from "../Routes/fee.routes.js";
import repair from "../Routes/repair.routes.js";
import taxiDriver from "../Routes/taxiDriver.routes.js";
import { PORT, SECRET_KEY, ENDPOINT, FE } from "./config.js";
import car from "../Routes/car.routes.js";
import carFee from "../Routes/carFee.routes.js";
import login from "../Routes/login.routes.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import cron from "node-cron";
import fetch from "node-fetch";

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: FE }));
app.use(cookieParser());
app.use(login);
app.use((req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { user: null };
  try {
    const data = jwt.verify(token, SECRET_KEY);
    req.session.user = data;
    console.log(data);
  } catch (error) {
    console.log(req.cookies);
    return res.status(401).json({ message: "Acceso no autorizado" });
  }
  next();
});

cron.schedule("0 0 1 * *", async() => {
  console.log(
    "Ejecutando tarea diaria a las 12:30 :",
    new Date().toLocaleString()
  );
  const today = new Date();
  const token = jwt.sign({ id: "ADMIN", username: "ADMIN" }, SECRET_KEY, {
    expiresIn: "1h",
  });
  const cookie = `access_token=${token}; Path=/; HttpOnly;`;
  let fees = [],
    repairs = [],
    cars = [];

  // tarifas
  try{
    const res = await fetch(ENDPOINT + "/Fee", {
      headers: { "Content-Type": "application/json", 'Cookie': cookie },
    })

    fees = await res.json()
    
  } catch(Error){
    console.error("Error",Error)
  }
    

  //reparaciones
  try{
    const res2 = await fetch(ENDPOINT + "/Repair", {
      headers: { "Content-Type": "application/json", 'Cookie': cookie },
    })

    repairs = await res2.json()
    
  } catch(Error){
    console.error("Error",Error)
  }
    

  //Vehiculos
  try{
    const res3 = await fetch(ENDPOINT + "/Car", {
      headers: { "Content-Type": "application/json", 'Cookie': cookie },
    })

    cars = await res3.json()
    
  } catch(Error){
    console.error("Error",Error)
  }

  let gains= [];
  let maintenances= [];
  
  for (let index = 0; index < cars.length; index++) {
    gains.push(0);
    maintenances.push(0);
  }
  
  for (let index = 0; index < fees.length; index++) {
    for (let j = 0; j < cars.length; j++) {
      const date = fees[index].delivery_date.split("T")
      if (cars[j].registration === fees[index].car && 
        today.getMonth() === (new Date(date[0])).getMonth() ){
        gains[j] += fees[index].amount;
      }
    }
  }
 
  for (let index = 0; index < repairs.length; index++) {
    for (let j = 0; j < cars.length; j++) {
      const date = repairs[index].repair_date.split("T")
      if ((cars[j].registration === repairs[index].car) && 
      today.getMonth() === (new Date(date[0])).getMonth()){
        console.log(repairs[index].car)
        maintenances[j] += repairs[index].cost;
      }
    }
  }

  
  for (let index = 0; index < cars.length; index++) {
   
    const residuo = gains[index] - maintenances[index];
    const bodyy = {
      gain: gains[index],
      maintenance:  maintenances[index],
      car: cars[index].registration,
      residuo: residuo
    };
    try{
      const res4 = await fetch(ENDPOINT + "/CarFee", {
        method: "POST",
        body: JSON.stringify(bodyy),
        headers: { "Content-Type": "application/json", 'Cookie': cookie },
      })
      
    } catch(Error){
      console.error("Error",Error)
    }
    
      
  }
});
app.use(fee);
app.use(repair);
app.use(taxiDriver);
app.use(car);
app.use(carFee);

app.listen(PORT, () => {
  console.log(`escuchando en el puerto, ${PORT}`);
});
