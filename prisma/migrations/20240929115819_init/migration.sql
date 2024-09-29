-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER,
    "channelName" TEXT,
    "baseChannelCode" TEXT,
    "channelOrderId" TEXT NOT NULL,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "pickupLocation" TEXT,
    "paymentStatus" TEXT,
    "total" DOUBLE PRECISION,
    "tax" DOUBLE PRECISION,
    "sla" TEXT,
    "shippingMethod" TEXT,
    "expedited" BOOLEAN,
    "status" TEXT,
    "statusCode" INTEGER,
    "paymentMethod" TEXT,
    "isInternational" BOOLEAN,
    "purposeOfShipment" INTEGER,
    "channelCreatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3),
    "allowReturn" BOOLEAN,
    "isIncomplete" BOOLEAN,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_channelOrderId_key" ON "Order"("channelOrderId");
