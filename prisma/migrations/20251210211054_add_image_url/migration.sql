/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Car` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    CONSTRAINT "Car_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Car" ("brandId", "id", "model", "price", "year") SELECT "brandId", "id", "model", "price", "year" FROM "Car";
DROP TABLE "Car";
ALTER TABLE "new_Car" RENAME TO "Car";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
