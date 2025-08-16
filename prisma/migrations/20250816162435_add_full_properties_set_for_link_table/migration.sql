/*
  Warnings:

  - You are about to drop the `links` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "links";

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(32) NOT NULL,
    "url" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "ownerId" TEXT,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_slug_key" ON "Link"("slug");

-- CreateIndex
CREATE INDEX "Link_createdAt_id_idx" ON "Link"("createdAt", "id" DESC);
