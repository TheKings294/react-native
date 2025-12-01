-- CreateEnum
CREATE TYPE "PlaceType" AS ENUM ('RESTAURANT', 'HOTEL', 'ATTRACTION', 'MUSEUM', 'PARK', 'BEACH', 'MOUNTAIN', 'CITY', 'VIEWPOINT', 'HIDDEN_GEM', 'CAFE', 'BAR', 'SHOP', 'TRANSPORTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "TipCategory" AS ENUM ('GENERAL', 'TRANSPORTATION', 'FOOD', 'ACCOMMODATION', 'SAFETY', 'BUDGET', 'TIMING', 'HIDDEN_SPOT', 'LOCAL_CULTURE', 'WARNING', 'INSIDER');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "BookTemplate" AS ENUM ('SIMPLE', 'TRAVEL_DIARY', 'PHOTO_ALBUM', 'MAGAZINE', 'MINIMALIST', 'CLASSIC');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_FOLLOWER', 'NEW_COMMENT', 'NEW_TIP_VOTE', 'ROADBOOK_SHARED', 'PLACE_RATED', 'MENTION', 'SYSTEM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "isProfilePublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" INT NOT NULL,
    "followerId" INT NOT NULL,
    "followingId" INT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" INT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT NOT NULL,
    "placeType" "PlaceType" NOT NULL,
    "tags" TEXT[],
    "googlePlaceId" TEXT,
    "osmId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "averageRating" DOUBLE PRECISION,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "totalTips" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritePlace" (
    "id" INT NOT NULL,
    "userId" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoritePlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaceRating" (
    "id" INT NOT NULL,
    "userId" INT NOT NULL,
    "placeId" INT NOT NULL,
    "overallRating" INTEGER NOT NULL,
    "atmosphereRating" INTEGER,
    "valueRating" INTEGER,
    "serviceRating" INTEGER,
    "review" TEXT,
    "photos" TEXT[],
    "visitDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaceRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tip" (
    "id" INT NOT NULL,
    "userId" INTEGER NOT NULL,
    "placeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "TipCategory" NOT NULL,
    "photos" TEXT[],
    "isWarning" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Tip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipVote" (
    "id" INT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tipId" INTEGER NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TipVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tipId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roadbook" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "countries" TEXT[],
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "template" "BookTemplate" NOT NULL DEFAULT 'SIMPLE',
    "theme" TEXT DEFAULT 'default',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Roadbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoadbookStop" (
    "id" INTEGER NOT NULL,
    "roadbookId" INTEGER NOT NULL,
    "placeId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "customLocation" TEXT,
    "arrivalDate" TIMESTAMP(3),
    "departureDate" TIMESTAMP(3),
    "dayNumber" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "photos" TEXT[],
    "mood" TEXT,
    "weather" TEXT,
    "temperature" DOUBLE PRECISION,
    "expenses" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoadbookStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedRoadbook" (
    "id" INTEGER NOT NULL,
    "roadbookId" INTEGER NOT NULL,
    "sharedWithUserId" INTEGER NOT NULL,
    "sharedByUserId" INTEGER NOT NULL,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedRoadbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteRoadbook" (
    "id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "roadbookId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteRoadbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Place_googlePlaceId_key" ON "Place"("googlePlaceId");

-- CreateIndex
CREATE INDEX "Place_country_city_idx" ON "Place"("country", "city");

-- CreateIndex
CREATE INDEX "Place_placeType_idx" ON "Place"("placeType");

-- CreateIndex
CREATE INDEX "Place_googlePlaceId_idx" ON "Place"("googlePlaceId");

-- CreateIndex
CREATE INDEX "Place_latitude_longitude_idx" ON "Place"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "FavoritePlace_userId_idx" ON "FavoritePlace"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoritePlace_userId_placeId_key" ON "FavoritePlace"("userId", "placeId");

-- CreateIndex
CREATE INDEX "PlaceRating_placeId_idx" ON "PlaceRating"("placeId");

-- CreateIndex
CREATE INDEX "PlaceRating_userId_idx" ON "PlaceRating"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaceRating_userId_placeId_key" ON "PlaceRating"("userId", "placeId");

-- CreateIndex
CREATE INDEX "Tip_placeId_idx" ON "Tip"("placeId");

-- CreateIndex
CREATE INDEX "Tip_userId_idx" ON "Tip"("userId");

-- CreateIndex
CREATE INDEX "Tip_category_idx" ON "Tip"("category");

-- CreateIndex
CREATE INDEX "TipVote_tipId_idx" ON "TipVote"("tipId");

-- CreateIndex
CREATE UNIQUE INDEX "TipVote_userId_tipId_key" ON "TipVote"("userId", "tipId");

-- CreateIndex
CREATE INDEX "Comment_tipId_idx" ON "Comment"("tipId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Roadbook_userId_idx" ON "Roadbook"("userId");

-- CreateIndex
CREATE INDEX "Roadbook_isPublic_isPublished_idx" ON "Roadbook"("isPublic", "isPublished");

-- CreateIndex
CREATE INDEX "RoadbookStop_roadbookId_idx" ON "RoadbookStop"("roadbookId");

-- CreateIndex
CREATE INDEX "RoadbookStop_placeId_idx" ON "RoadbookStop"("placeId");

-- CreateIndex
CREATE INDEX "RoadbookStop_roadbookId_dayNumber_orderIndex_idx" ON "RoadbookStop"("roadbookId", "dayNumber", "orderIndex");

-- CreateIndex
CREATE INDEX "SharedRoadbook_sharedWithUserId_idx" ON "SharedRoadbook"("sharedWithUserId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedRoadbook_roadbookId_sharedWithUserId_key" ON "SharedRoadbook"("roadbookId", "sharedWithUserId");

-- CreateIndex
CREATE INDEX "FavoriteRoadbook_userId_idx" ON "FavoriteRoadbook"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteRoadbook_userId_roadbookId_key" ON "FavoriteRoadbook"("userId", "roadbookId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritePlace" ADD CONSTRAINT "FavoritePlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritePlace" ADD CONSTRAINT "FavoritePlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceRating" ADD CONSTRAINT "PlaceRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaceRating" ADD CONSTRAINT "PlaceRating_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tip" ADD CONSTRAINT "Tip_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipVote" ADD CONSTRAINT "TipVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipVote" ADD CONSTRAINT "TipVote_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "Tip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "Tip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roadbook" ADD CONSTRAINT "Roadbook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadbookStop" ADD CONSTRAINT "RoadbookStop_roadbookId_fkey" FOREIGN KEY ("roadbookId") REFERENCES "Roadbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoadbookStop" ADD CONSTRAINT "RoadbookStop_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedRoadbook" ADD CONSTRAINT "SharedRoadbook_roadbookId_fkey" FOREIGN KEY ("roadbookId") REFERENCES "Roadbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedRoadbook" ADD CONSTRAINT "SharedRoadbook_sharedWithUserId_fkey" FOREIGN KEY ("sharedWithUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRoadbook" ADD CONSTRAINT "FavoriteRoadbook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteRoadbook" ADD CONSTRAINT "FavoriteRoadbook_roadbookId_fkey" FOREIGN KEY ("roadbookId") REFERENCES "Roadbook"("id") ON DELETE CASCADE ON UPDATE CASCADE;