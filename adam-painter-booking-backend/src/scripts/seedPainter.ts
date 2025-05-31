import prisma from "../prisma/client";

async function seedPainters() {
  const painters = [
    { id: "painter-123", name: "Painter One" },
    { id: "painter-456", name: "Painter Two" },
    { id: "painter-789", name: "Painter Three" },
  ];

  for (const painter of painters) {
    await prisma.painter.upsert({
      where: { id: painter.id },
      update: {},
      create: painter,
    });
  }

  console.log("✅ Painters seeded");
  process.exit();
}

seedPainters();
