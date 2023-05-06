/*
  Warnings:

  - You are about to drop the `CheckoutItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CheckoutItem" DROP CONSTRAINT "CheckoutItem_orderId_fkey";

-- DropTable
DROP TABLE "CheckoutItem";

-- CreateTable
CREATE TABLE "OrderHistoryItem" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "orderId" INTEGER,

    CONSTRAINT "OrderHistoryItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderHistoryItem" ADD CONSTRAINT "OrderHistoryItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
