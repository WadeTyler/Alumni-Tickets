
import express from 'express';
import {getMe, login, logout, signup} from '../controllers/auth.controller.js'
import protectedRoute from "../middlewares/protectedRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", protectedRoute, getMe);

export default router;