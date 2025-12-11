-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Car_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Car" ("brandId", "id", "imageUrl", "model", "price", "year") SELECT "brandId", "id", "imageUrl", "model", "price", "year" FROM "Car";
DROP TABLE "Car";
ALTER TABLE "new_Car" RENAME TO "Car";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
