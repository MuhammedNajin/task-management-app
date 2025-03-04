import express from "express";
import { initializeAuthRoute } from "./authRoutes";
import  { initializeTaskRouter } from "./taskRoutes";
import { initializeAnalyticsRouter } from "./taskAnalyticRoutes";
import { AuthUrl } from "../utils/types/Urls";
import { authMiddleware } from "../middleware/authorization";
import { Server } from "node:http";

const initializeRoute = (httpServer: Server) => {
  const router = express.Router();

  router.use(AuthUrl.Auth, initializeAuthRoute(httpServer));
  router.use(authMiddleware, initializeTaskRouter(httpServer));
  router.use(authMiddleware, initializeAnalyticsRouter(httpServer));

  return router;
};

export { initializeRoute };
