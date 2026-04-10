import allRoutes from "./Routes/index.routes.js";
import express from "express"; // ✅ ES Modules
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"; // 1. CORS import karein
import { webhookController } from "./controllers/paymentContoller/webHookStripeController.js";

dotenv.config();

const PORT =  process.env.PORT || 3002;

const app = express();


// 2. CORS Middleware configure karein
app.use(cors({
  origin: "http://localhost:5173", // Sirf apne frontend port ko allow karein
  methods: ["GET", "POST", "PUT", "DELETE"], // Jo methods aap use karna chahte hain
  credentials: true 
}));


app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), webhookController);
// Correct way to parse incoming JSON
app.use(express.json());

app.use("/api", allRoutes);    // all routes start here API route

// Start server after DB connects
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {

      console.log(`🚀 Server is listening on port ${PORT} `);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

startServer();