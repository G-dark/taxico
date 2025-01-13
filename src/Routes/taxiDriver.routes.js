import { deleteDriver, getDrivers,registerDriver, updateDriver } from "../Contollers/taxiDriverController.js";
import { Router } from "express";

const taxiDriver = Router();

taxiDriver.get("/API/Driver/:id",getDrivers);
taxiDriver.get("/API/Driver",getDrivers);
taxiDriver.post("/API/Driver",registerDriver);
taxiDriver.patch("/API/Driver/:id",updateDriver);
taxiDriver.delete("/API/Driver/:id",deleteDriver);


export default taxiDriver;