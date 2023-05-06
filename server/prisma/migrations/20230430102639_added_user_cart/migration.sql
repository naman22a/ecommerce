-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cart" TEXT[] DEFAULT ARRAY[]::TEXT[];
