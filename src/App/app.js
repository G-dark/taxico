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
import moment from "moment"

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

cron.schedule("30 12 1 * *", async() => {
  console.log(
    "Ejecutando tarea mensual a las 12:00 :",
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

cron.schedule("30 12 * * *", async() => {
  console.log(
    "Ejecutando tarea diaria a las 12:30 :",
    new Date().toLocaleString()
  );
  const today = new Date();
  const token = jwt.sign({ id: "ADMIN", username: "ADMIN" }, SECRET_KEY, {
    expiresIn: "1h",
  });
  const cookie = `access_token=${token}; Path=/; HttpOnly;`;
  let drivers = [],
    fees = [];

    // drivers
  try{
    const res = await fetch(ENDPOINT + "/Driver", {
      headers: { "Content-Type": "application/json", 'Cookie': cookie },
    })

    drivers = await res.json()
    
  } catch(Error){
    console.error("Error",Error)
  }

  // tarifas
  try{
    const res2 = await fetch(ENDPOINT + "/Fee", {
      headers: { "Content-Type": "application/json", 'Cookie': cookie },
    })

    fees = await res2.json()
    
  } catch(Error){
    console.error("Error",Error)
  }
  
  for (let index = 0; index < drivers.length; index++) {
    const partes = drivers[index].registered_at.split("T");
    const today = moment(new Date());
    const registeredat = moment(partes[0]);

    const paydays = today.diff(registeredat, "days");
    
    let payeddays = 0;

    for (let j = 0; j < fees.length; j++) {

      console.log(fees[j].car,fees[j].delivered_by)
      if (
        fees[j].car === drivers[index].car &&
        fees[j].delivered_by === drivers[index].ID
      ) {
        payeddays += 1;
      }
    }

    const diferencia = payeddays - paydays;
    console.log("Diferencia",diferencia, paydays,payeddays)
    const deficit=diferencia*50000
    
    const bodyy = {
      fn:drivers[index].firstname, sn: drivers[index].secondname, 
      ln:drivers[index].lastname, alias:drivers[index].alias, 
      ID:drivers[index].ID, car:drivers[index].car, 
      status:drivers[index]._status, deficit:deficit };
    try{
      const res4 = await fetch(ENDPOINT + "/Driver/"+drivers[index].ID, {
        method: "PATCH",
        body: JSON.stringify(bodyy),
        headers: { "Content-Type": "application/json", 'Cookie': cookie },
      })
      
    } catch(Error){
      console.error("Error",Error)
    }
    
      
  }
  
})
app.use(fee);
app.use(repair);
app.use(taxiDriver);
app.use(car);
app.use(carFee);

console.log("Iniciando aplicación Express...");
app.listen(PORT, '0.0.0.0', () => {
  console.log(`escuchando en el puerto, ${PORT}`);
});
