-- DropIndex
DROP INDEX "Link_createdAt_id_idx";

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Link_createdAt_id_idx" ON "Link"("createdAt", "id");
