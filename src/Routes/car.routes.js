import { deleteCar, getCars,registerCar, updateCar } from "../Contollers/carController.js";
import { Router } from "express";

const car = Router();

car.get("/API/Car/:id",getCars);
car.get("/API/Car",getCars);
car.post("/API/Car",registerCar);
car.patch("/API/Car/:id",updateCar);
car.delete("/API/Car/:id",deleteCar);


export default car;
