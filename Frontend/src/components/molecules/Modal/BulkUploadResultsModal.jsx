import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa';

const BulkUploadResultsModal = ({ isOpen, onClose, results }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-boxdark rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-stroke dark:border-strokedark">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Bulk Upload Results
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimesCircle className="text-2xl" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-auto max-h-[calc(80vh-120px)]">
          {/* Summary */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-success/10 text-center">
              <FaCheckCircle className="text-success text-2xl mx-auto mb-2" />
              <p className="text-success font-semibold">{results.success.length} Successful</p>
            </div>
            <div className="p-4 rounded-lg bg-warning/10 text-center">
              <FaExclamationCircle className="text-warning text-2xl mx-auto mb-2" />
              <p className="text-warning font-semibold">{results.duplicates.length} Duplicates</p>
            </div>
            <div className="p-4 rounded-lg bg-danger/10 text-center">
              <FaTimesCircle className="text-danger text-2xl mx-auto mb-2" />
              <p className="text-danger font-semibold">{results.errors.length} Errors</p>
            </div>
          </div>

          {/* Successful Candidates */}
          {results.success.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center">
                <FaCheckCircle className="text-success mr-2" />
                Successful Uploads
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 dark:bg-meta-4">
                      <th className="py-4 px-4 text-left">Name</th>
                      <th className="py-4 px-4 text-left">Email</th>
                      <th className="py-4 px-4 text-left">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.success.map((candidate, index) => (
                      <tr key={index} className="border-b border-stroke dark:border-strokedark">
                        <td className="py-4 px-4">{candidate.name}</td>
                        <td className="py-4 px-4">{candidate.email}</td>
                        <td className="py-4 px-4">{candidate.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Duplicate Candidates */}
          {results.duplicates.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center">
                <FaExclamationCircle className="text-warning mr-2" />
                Duplicate Entries
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 dark:bg-meta-4">
                      <th className="py-4 px-4 text-left">Name</th>
                      <th className="py-4 px-4 text-left">Email</th>
                      <th className="py-4 px-4 text-left">Phone</th>
                      <th className="py-4 px-4 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.duplicates.map((candidate, index) => (
                      <tr key={index} className="border-b border-stroke dark:border-strokedark">
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

          {/* Failed Candidates */}
          {results.errors.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-black dark:text-white mb-3 flex items-center">
                <FaTimesCircle className="text-danger mr-2" />
                Failed Uploads
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 dark:bg-meta-4">
                      <th className="py-4 px-4 text-left">Name</th>
                      <th className="py-4 px-4 text-left">Email</th>
                      <th className="py-4 px-4 text-left">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.errors.map((candidate, index) => (
                      <tr key={index} className="border-b border-stroke dark:border-strokedark">
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

        <div className="p-6 border-t border-stroke dark:border-strokedark">
          <button
            onClick={onClose}
            className="w-full rounded bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadResultsModal; 