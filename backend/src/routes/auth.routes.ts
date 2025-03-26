
import express from 'express';
import {getMe, login, logout, signup} from '../controllers/auth.controller.ts'
import protectedRoute from "../middlewares/protectedRoute.ts";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", protectedRoute, getMe);

export default router;