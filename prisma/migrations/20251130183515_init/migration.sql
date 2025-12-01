-- CreateTable
CREATE TABLE `AdminSecret` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `secretKey` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `updatedBy` INTEGER NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminSecret_secretKey_key`(`secretKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `username` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `isSuccess` BOOLEAN NOT NULL,
    `errorMessage` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SecretUpdateLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `secretId` INTEGER NOT NULL,
    `updatedBy` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `oldSecret` VARCHAR(191) NULL,
    `newSecret` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SecretUpdateLog` ADD CONSTRAINT `SecretUpdateLog_secretId_fkey` FOREIGN KEY (`secretId`) REFERENCES `AdminSecret`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
