import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

const UPLOADS_DIR = path.resolve(process.cwd(), ".uploads");

function generateHash(data: Buffer): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name;

    if (!fileName || fileName.includes("/") || fileName.includes("\\")) {
      return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
    }

    // Ensure uploads directory exists
    try {
      await mkdir(UPLOADS_DIR, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Write file to disk
    const filePath = path.resolve(UPLOADS_DIR, fileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileHash = generateHash(fileBuffer);

    // Path traversal defense
    if (!filePath.startsWith(UPLOADS_DIR + path.sep)) {
      return NextResponse.json({ error: "Path traversal detected" }, { status: 400 });
    }

    await writeFile(filePath, fileBuffer);

    // Create or update database record
    const now = new Date().toISOString();
    const existingRecord = await db.fileRecord.findUnique({
      where: { fileName },
    });

    if (existingRecord) {
      // Update existing record
      await db.fileRecord.update({
        where: { fileName },
        data: {
          hash: fileHash,
          contentType: file.type || "application/octet-stream",
          updatedDate: now,
        },
      });
    } else {
      // Create new record
      await db.fileRecord.create({
        data: {
          fileName,
          hash: fileHash,
          contentType: file.type || "application/octet-stream",
          createDate: now,
          updatedDate: now,
        },
      });
    }

    // Fetch all records to return updated list
    const fileRecords = await db.fileRecord.findMany();

    return NextResponse.json({ success: true, fileRecords, fileName }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
