import { Request, Response } from "express";
import prisma from "../prisma/client";

export const addAvailability = async (req: Request, res: Response) => {
  try {
    const painterId = (req as any).user?.userId;
    const { startTime, endTime } = req.body;

    if (!painterId) {
      return res.status(400).json({ error: "Missing painter ID" });
    }

    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ error: "Start and end time are required." });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ error: "Invalid time range." });
    }

    const exactMatch = await prisma.availability.findFirst({
      where: {
        painterId,
        startTime: start,
        endTime: end,
      },
    });

    if (exactMatch) {
      return res.status(409).json({
        error: "You already added availability for this exact time range.",
      });
    }

    const overlapping = await prisma.availability.findFirst({
      where: {
        painterId,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (overlapping) {
      return res.status(409).json({
        error: "This availability overlaps with an existing one.",
      });
    }

    const availability = await prisma.availability.create({
      data: {
        startTime: start,
        endTime: end,
        painterId,
      },
    });

    res.status(201).json(availability);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyAvailability = async (req: Request, res: Response) => {
  try {
    const painterId = (req as any).user?.userId;

    if (!painterId) {
      return res.status(400).json({ error: "Missing painter ID (X-User-Id)" });
    }

    const availability = await prisma.availability.findMany({
      where: { painterId },
      orderBy: { startTime: "asc" },
    });

    res.status(200).json(availability);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAvailability = async (req: Request, res: Response) => {
  try {
    const painterId = (req as any).user?.userId;
    const availabilityId = req.params.id;

    if (!painterId) {
      return res.status(400).json({ error: "Missing painter ID." });
    }

    const availability = await prisma.availability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability || availability.painterId !== painterId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this availability." });
    }

    const hasBooking = await prisma.booking.findFirst({
      where: {
        painterId,
        startTime: { gte: availability.startTime },
        endTime: { lte: availability.endTime },
        status: "confirmed",
      },
    });

    if (hasBooking) {
      return res.status(409).json({
        error: "Cannot delete availability with confirmed bookings.",
      });
    }

    await prisma.availability.delete({
      where: { id: availabilityId },
    });

    return res
      .status(200)
      .json({ message: "Availability deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
