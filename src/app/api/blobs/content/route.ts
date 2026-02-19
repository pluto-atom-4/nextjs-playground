import { readFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

const UPLOADS_DIR = path.resolve(process.cwd(), ".uploads");

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get("fileName");

  // Validate fileName
  if (!fileName) {
    return NextResponse.json({ error: "fileName parameter required" }, { status: 400 });
  }

  if (fileName.includes("/") || fileName.includes("\\") || fileName.includes("..")) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  // Path traversal defense
  const filePath = path.resolve(UPLOADS_DIR, fileName);
  if (!filePath.startsWith(UPLOADS_DIR + path.sep)) {
    return NextResponse.json({ error: "Path traversal detected" }, { status: 400 });
  }

  // Verify record exists in database
  const record = await db.fileRecord.findUnique({
    where: { fileName },
  });

  if (!record) {
    return NextResponse.json({ error: "File record not found" }, { status: 404 });
  }

  try {
    const content = await readFile(filePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": record.contentType || "text/plain",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
  }
}
