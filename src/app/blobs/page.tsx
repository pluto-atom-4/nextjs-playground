import { db } from "@/lib/db";
import BlobList from "./BlobList";

export default async function BlobsPage() {
  const fileRecords = await db.fileRecord.findMany();

  return (
    <main>
      <h1>File Records</h1>
      <BlobList initialRecords={fileRecords} />
    </main>
  );
}
