import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components';
import { FaDownload, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaArrowLeft, FaUserTie, FaMapMarked, FaFileAlt, FaInfoCircle, FaUserFriends, FaCalendarAlt, FaBriefcase, FaFileUpload, FaUserCircle } from 'react-icons/fa';
import { MdSource, MdWork, MdSchool } from 'react-icons/md';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { BiTimeFive } from 'react-icons/bi';

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

  const renderStatusBadge = (status) => {
    const statusColors = {
      applied: 'bg-warning/10 text-warning',
      screening: 'bg-info/10 text-info',
      shortlisted: 'bg-success/10 text-success',
      interviewed: 'bg-primary/10 text-primary',
      selected: 'bg-success/10 text-success',
      rejected: 'bg-danger/10 text-danger'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-500'}`}>
        {status.toUpperCase()}
      </span>
    );
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
      <BreadcrumbAdmin pageName="Candidate Details" />


      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Left Column - Profile Card */}
        <div className="md:col-span-4">
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

        {/* Right Column - Details */}
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 gap-4">
            {/* Status and Job Details Card */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke p-4 dark:border-strokedark">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                  Application Status
                </h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Current Status</span>
                      <div className="mt-1">
                        {renderStatusBadge(candidate.status)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Applied Date</span>
                      <p className="text-black dark:text-white">
                        {format(new Date(candidate.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Job Position</span>
                      <p className="text-black dark:text-white">{candidate.job?.title}</p>
                      <p className="text-sm text-gray-500">{candidate.job?.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Location</span>
                      <p className="text-black dark:text-white">
                        {candidate.job?.city}, {candidate.job?.state}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection Details Card - Show only if rejected */}
            {candidate.status === 'rejected' && candidate.rejection_information && (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke p-4 dark:border-strokedark">
                  <h4 className="text-xl font-semibold text-danger">
                    Rejection Details
                  </h4>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Reason</span>
                      <p className="text-black dark:text-white">{candidate.rejection_information.reason}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Stage</span>
                      <p className="text-black dark:text-white">{candidate.rejection_information.stage}</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-500">Comments</span>
                      <p className="text-black dark:text-white">{candidate.rejection_information.comments}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Rejected By</span>
                      <p className="text-black dark:text-white">{candidate.rejection_information.rejected_by}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Rejected On</span>
                      <p className="text-black dark:text-white">
                        {format(new Date(candidate.rejection_information.rejected_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Job Questions and Answers */}
            {candidate.questionnaire && candidate.questionnaire.length > 0 && (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke p-4 dark:border-strokedark">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    Job-Specific Questions
                  </h4>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {candidate.questionnaire.map((qa, index) => (
                      <div key={index} className="border-b border-stroke pb-4 last:border-0 last:pb-0">
                        <p className="text-sm font-medium text-gray-500 mb-2">{qa.question}</p>
                        <p className="text-black dark:text-white">{qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Professional Details */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke p-4 dark:border-strokedark">
                <h4 className="text-xl font-semibold text-black dark:text-white">
                  Professional Details
                </h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Experience</span>
                    <p className="text-black dark:text-white">{candidate.experience} years</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Current CTC</span>
                    <p className="text-black dark:text-white">{candidate.current_ctc} LPA</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Expected CTC</span>
                    <p className="text-black dark:text-white">{candidate.expected_ctc} LPA</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Notice Period</span>
                    <p className="text-black dark:text-white">{candidate.notice_period} days</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Current Location</span>
                    <p className="text-black dark:text-white">{candidate.current_location}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Preferred Location</span>
                    <p className="text-black dark:text-white">{candidate.preferred_location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            {candidate.notes && (
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke p-4 dark:border-strokedark">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    Additional Notes
                  </h4>
                </div>
                <div className="p-4">
                  <p className="text-black dark:text-white">{candidate.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default CandidateDetails; 