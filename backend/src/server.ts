import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import 'dotenv/config';
import db from './config/db.config.ts';

// Route imports
import authRoutes from './routes/auth.routes.ts';
import eventRoutes from './routes/event.routes.ts';
import ticketRoutes from "./routes/ticket.routes.ts";

const corsOptions = {
  origin: "http://localhost:4200",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);

const port = process.env.PORT || 8081;

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);

  const result = await db.query("SELECT NOW()");
  console.log("Database connected at: ", result.rows[0].now);
});
