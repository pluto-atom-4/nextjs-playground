"use client";

import { formatClientError } from "@/lib/error-handler";
import { type ReactElement, useCallback, useState } from "react";
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
  const [fileRecords, setFileRecords] = useState<FileRecord[]>(initialRecords);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

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

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const response = await fetch("/api/blobs/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      setFileRecords(data.fileRecords);
      setUploadError("");
    } catch (error) {
      const errorMessage = formatClientError(error, "Failed to upload file");
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
      // Reset the file input
      event.currentTarget.value = "";
    }
  }, []);

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

  const renderContent = (text: string, contentType: string | null) => {
    if (contentType === "text/markdown" || contentType === "text/x-markdown") {
      return <div className={styles.markdownContent}>{renderMarkdown(text)}</div>;
    }
    if (contentType === "application/json") {
      return (
        <div className={styles.jsonContent}>
          <pre>{formatContent(text, contentType)}</pre>
        </div>
      );
    }
    return <pre className={styles.preContent}>{text}</pre>;
  };

  const renderMarkdown = (markdown: string) => {
    const elements: ReactElement[] = [];
    const lines = markdown.split("\n");
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (!line.trim()) {
        i++;
        continue;
      }

      if (line.startsWith("# ")) {
        elements.push(<h1 key={elements.length}>{line.slice(2).trim()}</h1>);
      } else if (line.startsWith("## ")) {
        elements.push(<h2 key={elements.length}>{line.slice(3).trim()}</h2>);
      } else if (line.startsWith("### ")) {
        elements.push(<h3 key={elements.length}>{line.slice(4).trim()}</h3>);
      } else if (line.startsWith("#### ")) {
        elements.push(<h4 key={elements.length}>{line.slice(5).trim()}</h4>);
      } else if (line.startsWith("##### ")) {
        elements.push(<h5 key={elements.length}>{line.slice(6).trim()}</h5>);
      } else if (line.startsWith("###### ")) {
        elements.push(<h6 key={elements.length}>{line.slice(7).trim()}</h6>);
      } else if (line.startsWith("- ")) {
        const listItems = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          listItems.push(<li key={i}>{lines[i].slice(2).trim()}</li>);
          i++;
        }
        elements.push(<ul key={elements.length}>{listItems}</ul>);
        continue;
      } else {
        elements.push(<p key={elements.length}>{renderInlineMarkdown(line)}</p>);
      }

      i++;
    }

    return elements;
  };

  const renderInlineMarkdown = (text: string): ReactElement | string => {
    const parts: (ReactElement | string)[] = [];
    let lastIndex = 0;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /\*(.*?)\*/g;
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;

    const boldMatches = Array.from(text.matchAll(boldRegex));
    const italicMatches = Array.from(text.matchAll(italicRegex)).filter(
      (m) => !boldMatches.some((b) => b.index === m.index),
    );
    const linkMatches = Array.from(text.matchAll(linkRegex));

    const allMatches = [...boldMatches, ...italicMatches, ...linkMatches].sort(
      (a, b) => (a.index ?? 0) - (b.index ?? 0),
    );

    for (const match of allMatches) {
      if (!match.index) {
        continue;
      }
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      if (match[0].startsWith("**")) {
        parts.push(<strong key={parts.length}>{match[1]}</strong>);
      } else if (match[0].startsWith("[")) {
        parts.push(
          <a key={parts.length} href={match[2]} target="_blank" rel="noopener noreferrer">
            {match[1]}
          </a>,
        );
      } else {
        parts.push(<em key={parts.length}>{match[1]}</em>);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : <>{parts}</>;
  };

  if (fileRecords.length === 0) {
    return (
      <div>
        <div className={styles.uploadSection}>
          <label htmlFor="file-input" className={styles.uploadLabel}>
            <input
              id="file-input"
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              className={styles.fileInput}
              aria-label="Upload file"
            />
            <span className={styles.uploadButton}>
              {uploading ? "Uploading..." : "Upload File"}
            </span>
          </label>
          {uploadError && <p className={styles.error}>{uploadError}</p>}
        </div>
        <p>No file records found.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.uploadSection}>
        <label htmlFor="file-input" className={styles.uploadLabel}>
          <input
            id="file-input"
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            className={styles.fileInput}
            aria-label="Upload file"
          />
          <span className={styles.uploadButton}>{uploading ? "Uploading..." : "Upload File"}</span>
        </label>
        {uploadError && <p className={styles.error}>{uploadError}</p>}
      </div>
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
            {!loading && renderContent(content, selectedFile.contentType)}
          </dialog>
        </div>
      )}
    </>
  );
}
