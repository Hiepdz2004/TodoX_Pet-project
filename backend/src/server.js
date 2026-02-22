import express from "express";
import taskRoutes from './routes/taskRoutes.js';
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT;

const app = express();


//middlewares
app.use(express.json());

app.use(cors({origin: "http://localhost:5173"})); 

app.use("/api/tasks", taskRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server bắt đầu trên cổng ${PORT}`);
    });

});



