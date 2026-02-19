-- AlterTable
ALTER TABLE "users" ADD COLUMN "email_verified" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_key" ON "organizations"("name");

-- CreateTable
CREATE TABLE "organization_invites" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OPERATOR',
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_invites_token_key" ON "organization_invites"("token");

-- CreateIndex
CREATE INDEX "organization_invites_email_idx" ON "organization_invites"("email");

-- CreateIndex
CREATE INDEX "organization_invites_org_id_accepted_at_idx" ON "organization_invites"("org_id", "accepted_at");

-- AddForeignKey
ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
