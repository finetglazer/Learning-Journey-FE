import React, { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Spin, InputNumber, Tooltip } from "antd";
import {
  MenuOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "./ReactPdfViewer.scss";

// Set worker URL
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  fileUrl: string;
  loadingPreview?: boolean;
  code?: string;
}

const ReactPdfViewer: React.FC<Props> = ({ fileUrl, loadingPreview, code }) => {
  console.log("pdfjs.version", pdfjs.version);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Auto-update page number based on scroll position
  const handleScroll = useCallback(() => {
    const container = document.querySelector(".pdf-content");
    if (!container || numPages === 0) return;

    const pages = document.querySelectorAll(".pdf-page-wrapper");
    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // Find which page is most visible
    let currentVisiblePage = 1;
    let maxVisibleArea = 0;

    pages.forEach((page, index) => {
      const pageTop = (page as HTMLElement).offsetTop - container.scrollTop;
      const pageHeight = (page as HTMLElement).offsetHeight;

      // Calculate visible area of this page
      const visibleTop = Math.max(0, -pageTop);
      const visibleBottom = Math.min(pageHeight, containerHeight - pageTop);
      const visibleArea = Math.max(0, visibleBottom - visibleTop);

      if (visibleArea > maxVisibleArea) {
        maxVisibleArea = visibleArea;
        currentVisiblePage = index + 1;
      }
    });

    if (currentVisiblePage !== pageNumber) {
      setPageNumber(currentVisiblePage);
    }
  }, [numPages, pageNumber]);

  useEffect(() => {
    const container = document.querySelector(".pdf-content");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    setIsLoading(false);
  };

  const handlePageChange = (value: number | null) => {
    if (value && value >= 1 && value <= numPages) {
      setTimeout(() => {
        const pageElement = document.getElementById(`page-${value}`);
        if (pageElement) {
          pageElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
        }
      }, 100);
    }
  };

  const handleZoomChange = (value: number | null) => {
    if (value && value >= 25 && value <= 500) {
      setScale(value / 100);
    }
  };

  const zoomIn = () => {
    const newScale = Math.min(scale * 1.2, 5);
    setScale(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(scale / 1.2, 0.25);
    setScale(newScale);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFitToWidth = () => {
    // Calculate fit to width scale based on container
    setScale(1.2); // Simple implementation, can be improved
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${code || "document"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loadingPreview) {
    return (
      <div className="react-pdf-viewer loading">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <div className="react-pdf-viewer">
      {/* Toolbar */}
      <div className="pdf-toolbar">
        {/* Left section */}
        <div className="toolbar-left">
          <Tooltip title="Toggle sidebar">
            <div className="toolbar-icon" onClick={toggleSidebar}>
              <MenuOutlined />
            </div>
          </Tooltip>
          <span className="pdf-code">{code}</span>
        </div>

        {/* Center section */}
        <div className="toolbar-center">
          <div className="page-controls">
            <InputNumber
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={handlePageChange}
              className="page-input"
              controls={false}
            />
            <span className="page-separator">/</span>
            <span className="total-pages">{numPages}</span>
          </div>

          <div className="toolbar-divider" />

          <div className="zoom-controls">
            <Tooltip title="Zoom out">
              <div className="toolbar-icon" onClick={zoomOut}>
                <ZoomOutOutlined />
              </div>
            </Tooltip>

            <InputNumber
              min={25}
              max={500}
              value={Math.round(scale * 100)}
              onChange={handleZoomChange}
              className="zoom-input"
              controls={false}
              formatter={(value) => `${value}%`}
              parser={(value) => parseInt(value?.replace("%", "") || "100")}
            />

            <Tooltip title="Zoom in">
              <div className="toolbar-icon" onClick={zoomIn}>
                <ZoomInOutlined />
              </div>
            </Tooltip>
          </div>

          <div className="toolbar-divider" />

          <div className="view-controls">
            <Tooltip title="Fit to width">
              <div className="toolbar-icon" onClick={handleFitToWidth}>
                <FullscreenOutlined />
              </div>
            </Tooltip>

            <Tooltip title="Rotate">
              <div className="toolbar-icon" onClick={handleRotate}>
                <ReloadOutlined />
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Right section */}
        <div className="toolbar-right">
          <Tooltip title="Download">
            <div className="toolbar-icon" onClick={handleDownload}>
              <DownloadOutlined />
            </div>
          </Tooltip>

          <Tooltip title="Print">
            <div className="toolbar-icon" onClick={handlePrint}>
              <PrinterOutlined />
            </div>
          </Tooltip>

          <Tooltip title="More options">
            <div className="toolbar-icon">
              <MoreOutlined />
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Main content */}
      <div className="pdf-main">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="pdf-sidebar">
            <div className="sidebar-content">
              <h4>Thumbnails</h4>
              <div className="thumbnail-list">
                {Array.from(new Array(numPages), (el, index) => (
                  <div
                    key={`thumbnail_${index + 1}`}
                    className={`thumbnail ${
                      pageNumber === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    <Document file={fileUrl}>
                      <Page
                        pageNumber={index + 1}
                        width={100}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                    <span className="thumbnail-number">{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PDF Content */}
        <div className="pdf-content">
          {isLoading && (
            <div className="pdf-loading">
              <Spin size="large" tip="Đang tải PDF..." />
            </div>
          )}

          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<Spin size="large" tip="Đang tải document..." />}
            error={<div className="pdf-error">Không thể tải PDF</div>}
          >
            <div className="pdf-pages-container">
              {Array.from(new Array(numPages), (el, index) => (
                <div
                  key={`page_${index + 1}`}
                  className={`pdf-page-wrapper ${
                    pageNumber === index + 1 ? "current-page" : ""
                  }`}
                  id={`page-${index + 1}`}
                >
                  <Page
                    pageNumber={index + 1}
                    scale={scale}
                    rotate={rotation}
                    loading={<Spin tip={`Đang tải trang ${index + 1}...`} />}
                    error={
                      <div className="page-error">
                        Không thể tải trang {index + 1}
                      </div>
                    }
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="pdf-page"
                  />
                </div>
              ))}
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
};

export default ReactPdfViewer;
