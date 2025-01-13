import { deleteFee, getFees,registerFee, updateFee } from "../Contollers/feeController.js";
import { Router } from "express";

const fee = Router();

fee.get("/API/Fee",getFees);
fee.get("/API/Fee/:id",getFees);
fee.post("/API/Fee",registerFee);
fee.patch("/API/Fee/:id",updateFee);
fee.delete("/API/Fee/:id",deleteFee);


export default fee;