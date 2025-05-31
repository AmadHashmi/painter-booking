-- CreateTable
CREATE TABLE "Painter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "painterId" TEXT NOT NULL,
    CONSTRAINT "Availability_painterId_fkey" FOREIGN KEY ("painterId") REFERENCES "Painter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "painterId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Booking_painterId_fkey" FOREIGN KEY ("painterId") REFERENCES "Painter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
