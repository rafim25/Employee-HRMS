import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

const BulkUploadResultsModal = ({ isOpen, onClose, results }) => {
  if (!isOpen) return null;

  const success = results?.success || [];
  const duplicates = results?.duplicates || [];
  const errors = results?.errors || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1d36]/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-[rgba(212,175,55,0.35)] shadow-2xl">
        <div className="p-6 border-b border-[rgba(11,29,54,0.08)] bg-[#0b1d36]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">Upload</p>
              <h3 className="text-xl font-semibold text-white">
                Bulk Upload Results
              </h3>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#d4af37] hover:text-[#0b1d36]"
            >
              <FaTimesCircle className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(80vh-180px)] bg-[#dce6f0]/40">
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white text-center border border-[rgba(11,29,54,0.08)]">
              <FaCheckCircle className="text-success text-2xl mx-auto mb-2" />
              <p className="text-[#0b1d36] font-semibold text-base">{success.length} Successful</p>
            </div>
            <div className="p-4 rounded-2xl bg-white text-center border border-[rgba(11,29,54,0.08)]">
              <FaExclamationCircle className="text-warning text-2xl mx-auto mb-2" />
              <p className="text-[#0b1d36] font-semibold text-base">{duplicates.length} Duplicates</p>
            </div>
            <div className="p-4 rounded-2xl bg-white text-center border border-[rgba(11,29,54,0.08)]">
              <FaTimesCircle className="text-danger text-2xl mx-auto mb-2" />
              <p className="text-[#0b1d36] font-semibold text-base">{errors.length} Errors</p>
            </div>
          </div>

          {success.length > 0 && (
            <div className="mb-6 app-card overflow-hidden">
              <h4 className="text-lg font-semibold text-[#0b1d36] mb-0 flex items-center px-4 py-3">
                <FaCheckCircle className="text-success mr-2" />
                Successful Uploads
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="py-4 px-4 text-left">Name</th>
                      <th className="py-4 px-4 text-left">Email</th>
                      <th className="py-4 px-4 text-left">ID</th>
                      <th className="py-4 px-4 text-left">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {success.map((candidate, index) => (
                      <tr key={index} className="border-b border-[rgba(11,29,54,0.08)] bg-white">
                        <td className="py-4 px-4">{candidate.name}</td>
                        <td className="py-4 px-4">{candidate.email}</td>
                        <td className="py-4 px-4">{candidate.id}</td>
                        <td className="py-4 px-4 text-success">{candidate.message || 'Created successfully'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {duplicates.length > 0 && (
            <div className="mb-6 app-card overflow-hidden">
              <h4 className="text-lg font-semibold text-[#0b1d36] mb-0 flex items-center px-4 py-3">
                <FaExclamationCircle className="text-warning mr-2" />
                Duplicate Entries
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="py-4 px-4 text-left">Name</th>
                      <th className="py-4 px-4 text-left">Email</th>
                      <th className="py-4 px-4 text-left">Phone</th>
                      <th className="py-4 px-4 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duplicates.map((candidate, index) => (
                      <tr key={index} className="border-b border-[rgba(11,29,54,0.08)] bg-white">
                        <td className="py-4 px-4">{candidate.name}</td>
                        <td className="py-4 px-4">{candidate.email}</td>
                        <td className="py-4 px-4">{candidate.phone}</td>
                        <td className="py-4 px-4 text-warning">{candidate.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="app-card overflow-hidden">
              <h4 className="text-lg font-semibold text-[#0b1d36] mb-0 flex items-center px-4 py-3">
                <FaTimesCircle className="text-danger mr-2" />
                Failed Uploads
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="py-4 px-4 text-left">Name</th>
                      <th className="py-4 px-4 text-left">Email</th>
                      <th className="py-4 px-4 text-left">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {errors.map((candidate, index) => (
                      <tr key={index} className="border-b border-[rgba(11,29,54,0.08)] bg-white">
                        <td className="py-4 px-4">{candidate.name}</td>
                        <td className="py-4 px-4">{candidate.email}</td>
                        <td className="py-4 px-4 text-danger">{candidate.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[rgba(11,29,54,0.08)] bg-white">
          <button
            onClick={onClose}
            className="btn-gold w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadResultsModal;
