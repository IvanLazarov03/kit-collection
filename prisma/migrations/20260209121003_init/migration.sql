-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Jersey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "player" TEXT,
    "number" TEXT,
    "size" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "notes" TEXT,
    "price" REAL,
    "purchaseDate" DATETIME,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "collectionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Jersey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Jersey_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
CREATE INDEX "Jersey_userId_idx" ON "Jersey"("userId");

-- CreateIndex
CREATE INDEX "Jersey_team_idx" ON "Jersey"("team");

-- CreateIndex
CREATE INDEX "Jersey_season_idx" ON "Jersey"("season");

-- CreateIndex
CREATE INDEX "Jersey_isPublic_idx" ON "Jersey"("isPublic");

-- CreateIndex
CREATE INDEX "Collection_userId_idx" ON "Collection"("userId");
