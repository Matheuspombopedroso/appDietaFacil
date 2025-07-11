-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "calories" INTEGER NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "weekOfYear" INTEGER NOT NULL,
    "weeklyTargetKg" DOUBLE PRECISION NOT NULL,
    "monthlyTargetKg" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_date_key" ON "Entry"("date");
