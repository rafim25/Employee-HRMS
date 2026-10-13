import { FaDownload, FaTimes } from 'react-icons/fa';

/**
 * In-app document preview modal (PDF/image) with View + Download actions.
 */
const DocumentViewerModal = ({
  isOpen,
  onClose,
  title = 'Document',
  url,
  mimeType = '',
  onDownload,
}) => {
  if (!isOpen) return null;

  const isPdf = String(mimeType).includes('pdf') || String(url || '').toLowerCase().includes('.pdf');
  const isImage = String(mimeType).startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(url || '');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[rgba(11,29,54,0.1)] px-4 py-3">
          <h3 className="truncate text-lg font-semibold text-[#0b1d36]">{title}</h3>
          <div className="flex items-center gap-2">
            {url && (
              <button
                type="button"
                onClick={onDownload}
                className="btn-gold !flex !items-center !gap-2 !px-3 !py-2 text-sm"
              >
                <FaDownload /> Download
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1d36]/5 text-[#0b1d36] hover:bg-[#0b1d36] hover:text-white"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="min-h-[50vh] flex-1 bg-[#f4f6f8] p-3">
          {!url ? (
            <div className="flex h-full min-h-[50vh] items-center justify-center text-[#0b1d36]/60">
              No preview available
            </div>
          ) : isPdf ? (
            <iframe title={title} src={url} className="h-[70vh] w-full rounded-lg border border-[rgba(11,29,54,0.1)] bg-white" />
          ) : isImage ? (
            <div className="flex h-[70vh] items-center justify-center overflow-auto">
              <img src={url} alt={title} className="max-h-full max-w-full object-contain" />
            </div>
          ) : (
            <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3 text-[#0b1d36]/70">
              <p>Preview is not available for this file type.</p>
              <button type="button" className="btn-gold" onClick={onDownload}>Download file</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;
