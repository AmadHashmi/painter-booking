import { Request, Response } from "express";
import prisma from "../prisma/client";

export const addBookingRequest = async (req: Request, res: Response) => {
  try {
    const { startTime, endTime } = req.body;

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

    const clientId = (req as any).user?.userId;
    if (!clientId) {
      return res.status(400).json({ error: "Missing client ID from token." });
    }

    // 🚫 Prevent duplicate bookings for the same client in same range
    const existingBooking = await prisma.booking.findFirst({
      where: {
        clientId,
        startTime: { lte: end },
        endTime: { gte: start },
      },
    });

    if (existingBooking) {
      return res
        .status(409)
        .json({ error: "You already have a booking in this time range." });
    }

    // ✅ Find available painters
    const availableSlots = await prisma.availability.findMany({
      where: {
        startTime: { lte: start },
        endTime: { gte: end },
      },
      include: { painter: true },
    });

    if (!availableSlots || availableSlots.length === 0) {
      const closestSlot = await prisma.availability.findFirst({
        where: { startTime: { gte: end } },
        orderBy: { startTime: "asc" },
      });

      if (closestSlot) {
        return res.status(404).json({
          error: "No painters are available for the requested time slot.",
          suggestedStartTime: closestSlot.startTime,
          suggestedEndTime: closestSlot.endTime,
        });
      }

      return res.status(404).json({
        error: "No painters available and no alternatives found.",
      });
    }

    // ✅ Pick painter with fewest bookings
    const painterBookingCounts = await Promise.all(
      availableSlots.map(async (slot) => {
        const count = await prisma.booking.count({
          where: { painterId: slot.painterId },
        });
        return {
          painter: slot.painter,
          availability: slot,
          bookingCount: count,
        };
      })
    );

    const bestPainter = painterBookingCounts.sort(
      (a, b) => a.bookingCount - b.bookingCount
    )[0];

    // ✅ Prevent overlapping booking for same painter
    const overlappingPainterBooking = await prisma.booking.findFirst({
      where: {
        painterId: bestPainter.painter.id,
        startTime: { lte: end },
        endTime: { gte: start },
      },
    });

    if (overlappingPainterBooking) {
      return res.status(409).json({
        error: "The painter already has a booking in this time range.",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        startTime: start,
        endTime: end,
        painterId: bestPainter.painter.id,
        clientId,
        status: "confirmed",
      },
    });

    return res.status(201).json({
      bookingId: booking.id,
      painter: {
        id: bestPainter.painter.id,
        name: bestPainter.painter.name,
      },
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const role = (req as any).user?.role;

    if (!userId || !role) {
      return res.status(400).json({ error: "Invalid user credentials." });
    }

    const bookings = await prisma.booking.findMany({
      where: role === "PAINTER" ? { painterId: userId } : { clientId: userId },
      include: {
        painter: {
          select: {
            id: true,
            name: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { startTime: "asc" },
    });

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.userId;
    const bookingId = req.params.id;

    if (!clientId) {
      return res.status(400).json({ error: "Missing client ID." });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking || booking.clientId !== clientId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this booking." });
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return res.status(200).json({ message: "Booking deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
