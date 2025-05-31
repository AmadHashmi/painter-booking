import { Router } from "express";
import {
  addBookingRequest,
  deleteBooking,
  getMyBookings,
} from "../controllers/bookingController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, addBookingRequest);
router.get("/me", authenticate, getMyBookings);
router.delete("/:id", authenticate, deleteBooking);
export default router;
