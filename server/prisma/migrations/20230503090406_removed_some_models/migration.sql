/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_categories_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_categories_category" DROP CONSTRAINT "product_categories_category_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "product_categories_category" DROP CONSTRAINT "product_categories_category_productId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "product";

-- DropTable
DROP TABLE "product_categories_category";

-- DropEnum
DROP TYPE "Role";
