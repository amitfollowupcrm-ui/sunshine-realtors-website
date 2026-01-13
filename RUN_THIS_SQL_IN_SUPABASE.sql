-- Copy and paste this SQL into Supabase SQL Editor to create the tables
-- Go to: https://supabase.com/dashboard → Your Project → SQL Editor → New Query

-- CreateTable
CREATE TABLE IF NOT EXISTS "property_favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "property_cart" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "inquiry_type" TEXT NOT NULL DEFAULT 'BUY',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "property_shortlist" (
    "id" TEXT NOT NULL,
    "dealer_id" TEXT NOT NULL,
    "property_id" TEXT NOT NULL,
    "client_id" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_shortlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "property_favorites_user_id_idx" ON "property_favorites"("user_id");
CREATE INDEX IF NOT EXISTS "property_favorites_property_id_idx" ON "property_favorites"("property_id");
CREATE UNIQUE INDEX IF NOT EXISTS "property_favorites_user_id_property_id_key" ON "property_favorites"("user_id", "property_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "property_cart_user_id_idx" ON "property_cart"("user_id");
CREATE INDEX IF NOT EXISTS "property_cart_property_id_idx" ON "property_cart"("property_id");
CREATE UNIQUE INDEX IF NOT EXISTS "property_cart_user_id_property_id_key" ON "property_cart"("user_id", "property_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "property_shortlist_dealer_id_idx" ON "property_shortlist"("dealer_id");
CREATE INDEX IF NOT EXISTS "property_shortlist_property_id_idx" ON "property_shortlist"("property_id");
CREATE INDEX IF NOT EXISTS "property_shortlist_client_id_idx" ON "property_shortlist"("client_id");
CREATE UNIQUE INDEX IF NOT EXISTS "property_shortlist_dealer_id_property_id_key" ON "property_shortlist"("dealer_id", "property_id");

-- AddForeignKey
ALTER TABLE "property_favorites" ADD CONSTRAINT "property_favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_favorites" ADD CONSTRAINT "property_favorites_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "property_cart" ADD CONSTRAINT "property_cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_cart" ADD CONSTRAINT "property_cart_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "property_shortlist" ADD CONSTRAINT "property_shortlist_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_shortlist" ADD CONSTRAINT "property_shortlist_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;



