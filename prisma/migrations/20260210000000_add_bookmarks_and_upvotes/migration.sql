-- AlterTable
ALTER TABLE "Poster" ADD COLUMN "upvoteCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "PosterBookmark" (
    "id" TEXT NOT NULL,
    "posterId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PosterBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosterUpvote" (
    "id" TEXT NOT NULL,
    "posterId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PosterUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PosterBookmark_posterId_visitorId_key" ON "PosterBookmark"("posterId", "visitorId");

-- CreateIndex
CREATE UNIQUE INDEX "PosterUpvote_posterId_visitorId_key" ON "PosterUpvote"("posterId", "visitorId");

-- AddForeignKey
ALTER TABLE "PosterBookmark" ADD CONSTRAINT "PosterBookmark_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "Poster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosterUpvote" ADD CONSTRAINT "PosterUpvote_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "Poster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
