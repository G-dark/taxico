import { deleteRepair, getRepairs,registerRepair, updateRepair } from "../Contollers/repairController.js";
import { Router } from "express";

const repair = Router();

repair.get("/API/Repair",getRepairs);
repair.get("/API/Repair/:id",getRepairs);
repair.post("/API/Repair",registerRepair);
repair.patch("/API/Repair/:id",updateRepair);
repair.delete("/API/Repair/:id",deleteRepair);


export default repair;