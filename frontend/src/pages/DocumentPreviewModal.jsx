import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, File } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';

// Set up react-pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentPreviewModal = memo(({ isOpen, onClose, documentUrl, documentType }) => {
  const [fileBlobUrl, setFileBlobUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [numPages, setNumPages] = useState(null);

  // Convert Google Drive view link to direct download link
  const getDirectDownloadLink = (url) => {
    if (!url || typeof url !== 'string') return url;
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)\/view/);
    if (!match || !match[1]) return url;
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  };

  // Fetch file and create blob URL
  useEffect(() => {
    if (!isOpen || !documentUrl) return;

    const fetchFile = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const directUrl = getDirectDownloadLink(documentUrl);
        const response = await axios.get(directUrl, { responseType: 'blob' });
        const blob = new Blob([response.data], { type: documentType });
        const blobUrl = URL.createObjectURL(blob);
        setFileBlobUrl(blobUrl);
      } catch (err) {
        console.error('Error fetching file:', err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();

    // Cleanup blob URL
    return () => {
      if (fileBlobUrl) {
        URL.revokeObjectURL(fileBlobUrl);
        setFileBlobUrl(null);
      }
    };
  }, [isOpen, documentUrl, documentType]);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isImage = documentType.includes('image');
  const isPDF = documentType.includes('pdf');
  const isUnsupported = !isImage && !isPDF;

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold font-roboto text-gray-800">Document Preview</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition duration-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="relative flex justify-center items-center min-h-[50vh]">
          {isLoading && (
            <div className="absolute flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600 font-roboto">Loading preview...</span>
            </div>
          )}
          {hasError && (
            <div className="flex flex-col items-center text-center">
              <File className="h-12 w-12 text-red-500 mb-2" />
              <p className="text-red-600 font-roboto text-sm">Failed to load document. Please try again.</p>
            </div>
          )}
          {!isLoading && !hasError && isPDF && fileBlobUrl && (
            <Document
              file={fileBlobUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={() => setHasError(true)}
              loading={null}
              className="w-full"
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="mb-4 shadow-md"
                  width={Math.min(800, window.innerWidth * 0.8)}
                />
              ))}
            </Document>
          )}
          {!isLoading && !hasError && isImage && fileBlobUrl && (
            <img
              src={fileBlobUrl}
              alt="Document Preview"
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
              onError={() => setHasError(true)}
            />
          )}
          {!isLoading && !hasError && isUnsupported && (
            <div className="flex flex-col items-center text-center">
              <File className="h-12 w-12 text-gray-500 mb-2" />
              <p className="text-gray-600 font-roboto text-sm">Preview not available for this file type.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

export default DocumentPreviewModal;