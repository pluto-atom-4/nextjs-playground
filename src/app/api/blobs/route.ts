import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const fileRecords = await db.fileRecord.findMany();
    return NextResponse.json(fileRecords);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch file records" }, { status: 500 });
  }
}
