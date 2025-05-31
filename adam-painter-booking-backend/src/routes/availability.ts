import { Router } from "express";
import {
  addAvailability,
  deleteAvailability,
  getMyAvailability,
} from "../controllers/availabilityController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, addAvailability);
router.get("/me", authenticate, getMyAvailability);
router.delete("/:id", authenticate, deleteAvailability);

export default router;
