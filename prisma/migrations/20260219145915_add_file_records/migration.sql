-- CreateTable
CREATE TABLE "file_records" (
    "file_name" TEXT NOT NULL PRIMARY KEY,
    "create_date" TEXT,
    "updated_date" TEXT,
    "hash" TEXT,
    "content_type" TEXT
);
