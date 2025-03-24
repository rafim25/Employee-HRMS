import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { FaDownload, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaArrowLeft, FaUserTie, FaMapMarked, FaFileAlt, FaInfoCircle, FaUserFriends, FaCalendarAlt, FaBriefcase, FaFileUpload, FaUserCircle } from 'react-icons/fa';
import { MdSource } from 'react-icons/md';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/candidates/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch candidate details');
        }

        const data = await response.json();
        setCandidate(data);
      } catch (error) {
        setError(error.message);
        toast.error('Failed to load candidate details');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);
    formData.append('candidateId', candidate.uuid);

    setUploading(true);
    try {
      const response = await fetch(`/api/candidates/${candidate.uuid}/upload/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error(`Failed to upload ${type}`);

      const data = await response.json();
      setCandidate(prev => ({
        ...prev,
        [type === 'resume' ? 'resume_url' : 'image_url']: data.url
      }));
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  if (error || !candidate) {
    return (
      <DefaultLayoutAdmin>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {error || 'Candidate not found'}
          </p>
          <button
            onClick={() => navigate('/admin/recruitments/candidates')}
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <FaArrowLeft /> Back to Candidates
          </button>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="flex justify-between items-center mb-6">
          <BreadcrumbAdmin pageName="Candidate Details" />
          <button
            onClick={() => navigate('/admin/recruitments/candidates')}
            className="flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <FaArrowLeft /> Back to Candidates
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {/* Profile Card */}
          <div className="col-span-4 xl:col-span-1">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Profile Information
                </h3>
              </div>
              <div className="p-7">
                <div className="mb-4 flex flex-col items-center">
                  <div className="relative mb-4">
                    {candidate.image_url ? (
                      <img
                        src={candidate.image_url}
                        alt={candidate.name}
                        className="rounded-full w-32 h-32 object-cover border-4 border-primary/30"
                      />
                    ) : (
                      <FaUserCircle
                        className="w-32 h-32 text-gray-500 dark:text-gray-400"
                      />
                    )}
                    <label className="absolute bottom-0 right-0 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'image')}
                        disabled={uploading}
                      />
                      <div className="rounded-full bg-primary p-2 text-white hover:bg-primary/80">
                        <FaFileUpload size={16} />
                      </div>
                    </label>
                  </div>
                  <h5 className="mb-1 text-xl font-medium text-black dark:text-white">
                    {candidate.name}
                  </h5>
                  <p className="text-sm text-gray-500">{candidate.job?.title}</p>
                </div>

                {/* Resume Upload/Download Section */}
                <div className="mb-4 p-4 bg-gray-1 dark:bg-meta-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-black dark:text-white">Resume</span>
                    {candidate.resume_url ? (
                      <button
                        onClick={() => window.open(candidate.resume_url, '_blank')}
                        className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
                      >
                        <FaDownload size={14} /> Download
                      </button>
                    ) : null}
                  </div>
                  <label className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-primary/5">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'resume')}
                      disabled={uploading}
                    />
                    <FaFileUpload className="text-primary" />
                    <span className="text-sm text-gray-500">
                      {uploading ? 'Uploading...' : 'Upload Resume'}
                    </span>
                  </label>
                </div>

                <div className="mb-5.5">
                  <h5 className="mb-3 text-xl font-medium text-black dark:text-white">
                    {candidate.name}
                  </h5>
                  <div className="flex flex-col gap-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2" />
                      <span>{candidate.email}</span>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="mr-2" />
                      <span>{candidate.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <FaBuilding className="mr-2" />
                      <span>{candidate.current_company || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>Current: {candidate.current_location}</span>
                    </div>
                    <div className="flex items-center">
                      <FaMapMarked className="mr-2" />
                      <span>Preferred: {candidate.preferred_location}</span>
                    </div>
                    <div className="flex items-center">
                      <MdSource className="mr-2" />
                      <span>Source: {candidate.source}</span>
                    </div>
                    {candidate.referred_by && (
                      <div className="flex items-center">
                        <FaUserFriends className="mr-2" />
                        <span>Referred by: {candidate.referred_by}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Cards */}
          <div className="col-span-4 xl:col-span-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Professional Details Card */}
              <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
                  Professional Details
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center">
                    <FaUserTie className="mr-2 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Experience</span>
                      <p className="text-black dark:text-white">{candidate.experience} years</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Current CTC</span>
                      <p className="text-black dark:text-white">{candidate.current_ctc} LPA</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Expected CTC</span>
                      <p className="text-black dark:text-white">{candidate.expected_ctc} LPA</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Notice Period</span>
                      <p className="text-black dark:text-white">{candidate.notice_period} days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Status Card */}
              <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h4 className="mb-4 text-xl font-semibold text-black dark:text-white">
                  Application Status
                </h4>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center">
                    <FaInfoCircle className="mr-2 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Current Status</span>
                      <p className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                          ${candidate.status === 'selected' ? 'bg-success/10 text-success' :
                            candidate.status === 'rejected' ? 'bg-danger/10 text-danger' :
                              'bg-warning/10 text-warning'}`}>
                          {candidate.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Applied Date</span>
                      <p className="text-black dark:text-white">
                        {format(new Date(candidate.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaBriefcase className="mr-2 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Job Details</span>
                      <p className="text-black dark:text-white">
                        {candidate.job?.title} ({candidate.job?.type})
                      </p>
                      <p className="text-sm text-gray-500">
                        {candidate.job?.city}, {candidate.job?.state}
                      </p>
                    </div>
                  </div>
                  {candidate.notes && (
                    <div className="flex items-start">
                      <FaFileAlt className="mr-2 mt-1 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Notes</span>
                        <p className="text-black dark:text-white">{candidate.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default CandidateDetails; 