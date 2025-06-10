/*
  Warnings:

  - Added the required column `shippingInfo` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "paymentMethod" AS ENUM ('CASH_ON_DELIVERY', 'ONLINE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "payment" "paymentMethod" NOT NULL DEFAULT 'ONLINE',
ADD COLUMN     "shippingInfo" TEXT NOT NULL;
