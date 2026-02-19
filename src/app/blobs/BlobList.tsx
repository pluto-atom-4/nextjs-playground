"use client";

import { formatClientError } from "@/lib/error-handler";
import { useState } from "react";
import styles from "./blobs.module.css";

interface FileRecord {
  fileName: string;
  createDate: string | null;
  updatedDate: string | null;
  hash: string | null;
  contentType: string | null;
}

interface BlobListProps {
  initialRecords: FileRecord[];
}

const VIEWABLE = new Set([
  "application/json",
  "text/markdown",
  "text/x-markdown",
  "text/plain",
  "text/csv",
]);

export default function BlobList({ initialRecords }: BlobListProps) {
  const [fileRecords] = useState<FileRecord[]>(initialRecords);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleView = async (record: FileRecord) => {
    setSelectedFile(record);
    setLoading(true);
    try {
      const response = await fetch(
        `/api/blobs/content?fileName=${encodeURIComponent(record.fileName)}`,
      );
      if (!response.ok) {
        const errorMessage = formatClientError(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          "Failed to fetch content",
        );
        setContent(`Error loading content: ${errorMessage}`);
      } else {
        const text = await response.text();
        setContent(text);
      }
    } catch (error) {
      const errorMessage = formatClientError(error, "Failed to load content");
      setContent(`Error loading content: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const isViewable = (contentType: string | null) => {
    return contentType && VIEWABLE.has(contentType);
  };

  const formatContent = (text: string, contentType: string | null) => {
    if (contentType === "application/json") {
      try {
        return JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        return text;
      }
    }
    return text;
  };

  if (fileRecords.length === 0) {
    return <p>No file records found.</p>;
  }

  return (
    <>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.tableCell}>File Name</th>
            <th className={styles.tableCell}>Content Type</th>
            <th className={styles.tableCell}>Created Date</th>
            <th className={styles.tableCell}>Updated Date</th>
            <th className={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fileRecords.map((record) => (
            <tr key={record.fileName}>
              <td className={styles.tableCell}>{record.fileName}</td>
              <td className={styles.tableCell}>{record.contentType || "—"}</td>
              <td className={styles.tableCell}>
                {record.createDate ? new Date(record.createDate).toLocaleString() : "—"}
              </td>
              <td className={styles.tableCell}>
                {record.updatedDate ? new Date(record.updatedDate).toLocaleString() : "—"}
              </td>
              <td className={styles.tableCell}>
                <button
                  type="button"
                  className={styles.viewButton}
                  onClick={() => handleView(record)}
                  disabled={!isViewable(record.contentType)}
                  title={
                    isViewable(record.contentType) ? "View content" : "Content type not viewable"
                  }
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedFile && (
        <div
          className={`${styles.modal} ${selectedFile ? styles.open : ""}`}
          onClick={() => setSelectedFile(null)}
          role="presentation"
          onKeyDown={(e) => e.key === "Escape" && setSelectedFile(null)}
        >
          <dialog
            className={styles.modalContent}
            open
            onKeyDown={(e) => e.key === "Escape" && setSelectedFile(null)}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setSelectedFile(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <h2>{selectedFile.fileName}</h2>
            {loading && <p>Loading...</p>}
            {!loading && (
              <pre className={styles.preContent}>
                {formatContent(content, selectedFile.contentType)}
              </pre>
            )}
          </dialog>
        </div>
      )}
    </>
  );
}
