-- AlterTable
ALTER TABLE "users" ADD COLUMN "email_verified" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_key" ON "organizations"("name");
