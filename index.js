import userRoutes from "./Routes/user.routes.js";
import express from "express"; // ✅ ES Modules
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const PORT =  process.env.PORT || 3001;

const app = express();
// Correct way to parse incoming JSON
app.use(express.json());
app.use("/api/user", userRoutes);    // register API route
app.use("/api/forgotPassword", userRoutes);   //  login API route


// Start server after DB connects
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

startServer();