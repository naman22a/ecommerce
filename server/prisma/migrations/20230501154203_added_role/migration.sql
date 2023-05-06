-- CreateEnum
CREATE TYPE "Role" AS ENUM ('NORMAL_USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'NORMAL_USER';
