import { deleteCarFee, getCarFees,registerCarFee, updateCarFee } from "../Contollers/carFeeController.js";
import { Router } from "express";

const carFee = Router();

carFee.get("/API/CarFee/:id",getCarFees);
carFee.get("/API/CarFee",getCarFees);
carFee.post("/API/CarFee",registerCarFee);
carFee.patch("/API/CarFee/:id",updateCarFee);
carFee.delete("/API/CarFee/:id",deleteCarFee);


export default carFee;
