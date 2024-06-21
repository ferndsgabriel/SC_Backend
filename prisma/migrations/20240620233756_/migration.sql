-- CreateTable
CREATE TABLE "Adm" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "codRecovery" TEXT,
    "codDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "countCod" INTEGER NOT NULL DEFAULT 0,
    "dateChangePass" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Adm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tower" (
    "id" TEXT NOT NULL,
    "numberTower" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartment" (
    "id" TEXT NOT NULL,
    "numberApt" TEXT NOT NULL,
    "payment" BOOLEAN NOT NULL DEFAULT true,
    "payday" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "tower_id" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "cpf" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "photo" TEXT,
    "accountStatus" BOOLEAN,
    "phone_number" TEXT NOT NULL,
    "apartment_id" TEXT NOT NULL,
    "codRecovery" TEXT,
    "codDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "countCod" INTEGER NOT NULL DEFAULT 0,
    "dateChangePass" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "guest" TEXT,
    "reservationStatus" BOOLEAN,
    "cleaningService" BOOLEAN NOT NULL,
    "date" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "finish" INTEGER NOT NULL,
    "iWas" BOOLEAN,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "apartment_id" TEXT NOT NULL,
    "approvalDate" TIMESTAMP(3),
    "createDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IsCanceled" (
    "id" TEXT NOT NULL,
    "apartment_id" TEXT NOT NULL,
    "isTaxed" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "dateGuest" INTEGER NOT NULL,
    "dateCancellation" INTEGER NOT NULL,
    "createDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IsCanceled_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaitingList" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "createDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "adm_id" TEXT,
    "createDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliations" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "createDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avaliations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Adm_email_key" ON "Adm"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Adm_phone_number_key" ON "Adm"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_photo_key" ON "User"("photo");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_tower_id_fkey" FOREIGN KEY ("tower_id") REFERENCES "Tower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IsCanceled" ADD CONSTRAINT "IsCanceled_apartment_id_fkey" FOREIGN KEY ("apartment_id") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaitingList" ADD CONSTRAINT "WaitingList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_adm_id_fkey" FOREIGN KEY ("adm_id") REFERENCES "Adm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliations" ADD CONSTRAINT "Avaliations_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
