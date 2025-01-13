import { Router } from "express";
import { registUser, logUser,refreshToken} from "../Contollers/userController.js"

const login = Router();

login.post("/API/log", logUser)
login.post("/API/register", registUser)
login.post("/API/RefreshToken",refreshToken)

export default login;