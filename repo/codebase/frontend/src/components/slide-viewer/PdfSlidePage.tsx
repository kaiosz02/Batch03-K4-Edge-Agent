"use client";

import { useCallback, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfSlidePageProps {
  url: string;
  pageNumber: number;
  /** Chiều rộng hiển thị (px) — khớp text layer */
  width: number;
  onLoadError?: (message: string) => void;
}

export default function PdfSlidePage({
  url,
  pageNumber,
  width,
  onLoadError,
}: PdfSlidePageProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  const options = useMemo(
    () => ({
      withCredentials: false,
    }),
    []
  );

  const onDocumentLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n);
  }, []);

  const safePage = Math.min(Math.max(pageNumber, 1), numPages ?? pageNumber);
  // Tránh width=0 lúc mount → PDF vỡ
  const renderWidth = Math.max(320, Math.floor(width));

  return (
    <Document
      file={url}
      options={options}
      loading={
        <div
          className="flex items-center justify-center text-on-surface-variant text-sm bg-white/5 rounded-xl"
          style={{ width: renderWidth, minHeight: Math.round(renderWidth * 0.56) }}
        >
          Đang tải slide…
        </div>
      }
      error={
        <div
          className="flex items-center justify-center text-red-400 text-sm px-4 text-center bg-red-400/5 rounded-xl"
          style={{ width: renderWidth, minHeight: 200 }}
        >
          Không tải được PDF. Kiểm tra backend đang chạy và CORS.
        </div>
      }
      onLoadSuccess={onDocumentLoadSuccess}
      onLoadError={(err: Error) => onLoadError?.(err.message)}
      className="flex justify-center leading-none"
    >
      <Page
        pageNumber={safePage}
        width={renderWidth}
        renderTextLayer
        renderAnnotationLayer={false}
        className="pdf-page"
        loading={
          <div
            className="flex items-center justify-center text-on-surface-variant text-sm bg-white"
            style={{ width: renderWidth, minHeight: Math.round(renderWidth * 0.56) }}
          >
            Đang render trang…
          </div>
        }
      />
    </Document>
  );
}
