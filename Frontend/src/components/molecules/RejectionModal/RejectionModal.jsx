import React, { useState } from 'react';

const RejectionModal = ({ isOpen, onClose, onConfirm, currentStage }) => {
  const [rejectionDetails, setRejectionDetails] = useState({
    reason: '',
    stage: currentStage || '',
    comments: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(rejectionDetails);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-black dark:text-white">
            Rejection Details
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Rejection Reason <span className="text-meta-1">*</span>
                </label>
                <select
                  value={rejectionDetails.reason}
                  onChange={(e) => setRejectionDetails(prev => ({ ...prev, reason: e.target.value }))}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="">Select Reason</option>
                  <option value="Skills Mismatch">Skills Mismatch</option>
                  <option value="Experience Gap">Experience Gap</option>
                  <option value="Salary Expectations">Salary Expectations</option>
                  <option value="Cultural Fit">Cultural Fit</option>
                  <option value="Background Check">Background Check</option>
                  <option value="Communication Skills">Communication Skills</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Rejection Stage <span className="text-meta-1">*</span>
                </label>
                <select
                  value={rejectionDetails.stage}
                  onChange={(e) => setRejectionDetails(prev => ({ ...prev, stage: e.target.value }))}
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="">Select Stage</option>
                  <option value="Initial Screening">Initial Screening</option>
                  <option value="Technical Round">Technical Round</option>
                  <option value="HR Round">HR Round</option>
                  <option value="Final Round">Final Round</option>
                </select>
              </div>

              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Additional Comments <span className="text-meta-1">*</span>
                </label>
                <textarea
                  value={rejectionDetails.comments}
                  onChange={(e) => setRejectionDetails(prev => ({ ...prev, comments: e.target.value }))}
                  required
                  rows="3"
                  placeholder="Enter detailed reason for rejection..."
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-md border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal; 