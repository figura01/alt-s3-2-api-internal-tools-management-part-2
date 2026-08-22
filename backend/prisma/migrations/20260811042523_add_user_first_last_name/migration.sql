/*
Warnings:

- Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
- Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users"
ADD COLUMN "firstName" TEXT,
ADD COLUMN "lastName" TEXT;

UPDATE "users"
SET
    "firstName" = COALESCE(
        NULLIF(
            split_part("name", ' ', 1),
            ''
        ),
        'Unknown'
    ),
    "lastName" = COALESCE(
        NULLIF(
            regexp_replace("name", '^[^ ]+ ?', ''),
            ''
        ),
        'Unknown'
    );

ALTER TABLE "users"
ALTER COLUMN "firstName"
SET NOT NULL,
ALTER COLUMN "lastName"
SET NOT NULL;