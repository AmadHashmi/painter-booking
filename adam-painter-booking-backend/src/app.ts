import express from "express";
import cors from "cors";
import availabilityRoutes from "./routes/availability";
import bookingRoutes from "./routes/booking";
import authRoutes from "./routes/auth";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/availability", availabilityRoutes);
app.use("/bookings", bookingRoutes);
app.use("/auth", authRoutes);

export default app;
