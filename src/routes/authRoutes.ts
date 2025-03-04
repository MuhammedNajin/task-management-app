import express from "express";
import { AuthController } from "../controllers/AuthController";
import { DIContainer } from "../di/container";
import { validateRequest } from "../middleware/requestValidation";
import {
  loginSchema,
  userRegistrationSchema,
} from "../utils/validationSchema/Auth.schema";
import { AuthUrl } from "../utils/types/Urls";
import { Server } from "node:http";



const initializeAuthRoute = (httpServer: Server) => {
  const router = express.Router();
  const authController = new AuthController(
    DIContainer.getInstance(httpServer).get("AuthService")
  );
  
  const validateLogin = validateRequest(loginSchema);
  const validateRegister = validateRequest(userRegistrationSchema);
  
  router.post(
    AuthUrl.REGISTER,
    validateRegister,
    authController.register.bind(authController)
  );
  
  router.post(
    AuthUrl.LOGIN,
    validateLogin,
    authController.login.bind(authController)
  );
  return router;
}



export { initializeAuthRoute }
