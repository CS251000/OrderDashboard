-- CreateTable
CREATE TABLE "Order" (
    "sno" SERIAL NOT NULL,
    "id" INTEGER NOT NULL,
    "channelId" INTEGER,
    "channelName" TEXT,
    "baseChannelCode" TEXT,
    "channelOrderId" TEXT NOT NULL,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "customerAddress" TEXT,
    "customerAddress2" TEXT,
    "customerCity" TEXT,
    "customerState" TEXT,
    "customerPincode" TEXT,
    "customerCountry" TEXT,
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
    "errors" TEXT[],
    "showEscalationBtn" BOOLEAN,
    "escalationStatus" TEXT,
    "escalationHistory" TEXT[],

    CONSTRAINT "Order_pkey" PRIMARY KEY ("channelOrderId")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL,
    "channelOrderProductId" TEXT,
    "name" TEXT,
    "channelSku" TEXT,
    "quantity" INTEGER,
    "productId" INTEGER,
    "available" INTEGER,
    "status" TEXT,
    "hsn" TEXT,
    "orderId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" INTEGER NOT NULL,
    "isdCode" TEXT,
    "courier" TEXT,
    "weight" DOUBLE PRECISION,
    "dimensions" TEXT,
    "pickupScheduledDate" TIMESTAMP(3),
    "pickupTokenNumber" TEXT,
    "awb" TEXT,
    "returnAwb" TEXT,
    "volumetricWeight" DOUBLE PRECISION,
    "pod" TEXT,
    "etd" TEXT,
    "rtoDeliveredDate" TIMESTAMP(3),
    "deliveredDate" TIMESTAMP(3),
    "etdEscalationBtn" BOOLEAN,
    "orderId" TEXT,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "action" TEXT,
    "orderId" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("channelOrderId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("channelOrderId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("channelOrderId") ON DELETE SET NULL ON UPDATE CASCADE;
