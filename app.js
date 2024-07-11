import express from "express";
import cors from "cors"; 
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import {dataBaseConnection} from "./database/dataBaseConnection.js";
import hospitalMessageRouter from "./router/messageRouter.js";
import { errorMiddleweare } from "./middlewear/errorMiddlewear.js";
import userRouter from "./router/userRouter.js";
import {config} from "dotenv"; 
import appointmentRouter from "./router/appointmentRounter.js";
 

// Initialize Express app
const app = express();

// Load environment variables
config({path:"./.env"});

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.DASHBOARD_URL,
      process.env.LOCAL_API,
      process.env.MESSAGE_API
    ],////////////
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);

// Routers
app.use("/api/v1.1/hospitalmessage", hospitalMessageRouter);
app.use("/api/v1.1/userrigister", userRouter);
app.use("/api/v1.1/appointment",appointmentRouter)
// Database connection
dataBaseConnection();

// Error middleware
app.use(errorMiddleweare); // Ensure the error middleware is properly defined and imported

export default app;
