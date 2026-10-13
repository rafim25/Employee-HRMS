import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../../components';
import {
  FaRupeeSign,
  FaFileUpload,
  FaMapMarkerAlt,
  FaUser,
  FaBriefcase,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../services/api';
import {
  parseLocationString,
  findStateMatch,
  findCityMatch,
  formatLocation,
  emptyLocation,
} from '../../../../Utils/locationHelpers';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

const CandidateEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    current_company: '',
    current_ctc: '',
    expected_ctc: '',
    notice_period: '',
    current_location: '',
    preferred_location: '',
    status: '',
    notes: '',
    job_id: '',
    source: '',
    referred_by: '',
    resume_url: '',
    created_by: '',
    created_by_id: '',
    job_answers: {},
    rejection_reason: '',
    rejection_details: {
      reason: '',
      stage: '',
      rejected_by: '',
      rejected_at: null,
      comments: '',
    },
  });
  const [resume, setResume] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(emptyLocation());
  const [preferredLocation, setPreferredLocation] = useState(emptyLocation());
  const [currentCities, setCurrentCities] = useState([]);
  const [preferredCities, setPreferredCities] = useState([]);
  const [currentCitiesLoading, setCurrentCitiesLoading] = useState(false);
  const [preferredCitiesLoading, setPreferredCitiesLoading] = useState(false);
  const [manualLocationMode, setManualLocationMode] = useState({
    current: false,
    preferred: false,
  });
  const [statesFetchFailed, setStatesFetchFailed] = useState(false);

  const sourceOptions = [
    'Naukri',
    'Direct',
    'LinkedIn',
    'Indeed',
    'Referral',
    'Agency',
    'Other',
  ];

  const fetchCities = useCallback(async (stateCode, type) => {
    if (!stateCode) {
      if (type === 'current') setCurrentCities([]);
      else setPreferredCities([]);
      return [];
    }

    if (type === 'current') setCurrentCitiesLoading(true);
    else setPreferredCitiesLoading(true);

    try {
      const response = await axiosInstance.get(
        `/api/locations/states/${stateCode}/districts`,
        { headers: authHeaders() }
      );
      const cities = response.data || [];
      if (type === 'current') setCurrentCities(cities);
      else setPreferredCities(cities);
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Failed to load cities');
      if (type === 'current') setCurrentCities([]);
      else setPreferredCities([]);
      return [];
    } finally {
      if (type === 'current') setCurrentCitiesLoading(false);
      else setPreferredCitiesLoading(false);
    }
  }, []);

  const hydrateLocation = useCallback(
    async (locationString, type, statesList) => {
      const { stateName, cityName } = parseLocationString(locationString);
      if (!stateName && !cityName) {
        if (type === 'current') setCurrentLocation(emptyLocation());
        else setPreferredLocation(emptyLocation());
        return;
      }

      const matchedState = findStateMatch(statesList, stateName);

      if (!matchedState) {
        const manual = {
          state: '',
          stateName: stateName,
          city: '',
          cityName: cityName,
          manual: true,
        };
        if (type === 'current') {
          setCurrentLocation(manual);
          setManualLocationMode((prev) => ({ ...prev, current: true }));
        } else {
          setPreferredLocation(manual);
          setManualLocationMode((prev) => ({ ...prev, preferred: true }));
        }
        return;
      }

      const stateCode = matchedState.iso2 || matchedState.code;
      const cities = await fetchCities(stateCode, type);
      const matchedCity = findCityMatch(cities, cityName);

      if (cityName && !matchedCity) {
        const manual = {
          state: stateCode,
          stateName: matchedState.name,
          city: '',
          cityName: cityName,
          manual: true,
        };
        if (type === 'current') {
          setCurrentLocation(manual);
          setManualLocationMode((prev) => ({ ...prev, current: true }));
        } else {
          setPreferredLocation(manual);
          setManualLocationMode((prev) => ({ ...prev, preferred: true }));
        }
        return;
      }

      const resolved = {
        state: stateCode,
        stateName: matchedState.name,
        city: matchedCity ? String(matchedCity.id) : '',
        cityName: matchedCity?.name || cityName || '',
        manual: false,
      };
      if (type === 'current') setCurrentLocation(resolved);
      else setPreferredLocation(resolved);
    },
    [fetchCities]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);
        setJobsLoading(true);
        setStatesLoading(true);

        const [candidateRes, jobsRes, statesRes] = await Promise.all([
          axiosInstance.get(`/api/employee/candidates/${id}`, {
            headers: authHeaders(),
          }),
          axiosInstance.get('/api/employee/jobs', { headers: authHeaders() }),
          axiosInstance.get('/api/locations/states', { headers: authHeaders() }),
        ]);

        const candidateData = candidateRes.data?.candidate || candidateRes.data;
        const jobsData = Array.isArray(jobsRes.data)
          ? jobsRes.data
          : jobsRes.data?.jobs || [];
        const statesData = statesRes.data || [];

        const selectedJobData = jobsData.find(
          (job) => String(job.id) === String(candidateData.job_id)
        );
        setSelectedJob(selectedJobData || null);

        setFormData({
          ...candidateData,
          job_id: candidateData.job_id ?? candidateData.job?.id ?? '',
          status: candidateData.application_status || candidateData.status || '',
          job_answers: candidateData.job_answers || {},
          rejection_details:
            candidateData.rejection_information ||
            candidateData.rejection_details || {
              reason: '',
              stage: '',
              rejected_by: '',
              rejected_at: null,
              comments: '',
            },
        });
        setJobs(jobsData);
        setStates(statesData);
        setStatesFetchFailed(false);

        await Promise.all([
          hydrateLocation(candidateData.current_location, 'current', statesData),
          hydrateLocation(candidateData.preferred_location, 'preferred', statesData),
        ]);
      } catch (error) {
        console.error('Error loading candidate:', error);
        if (error?.response?.config?.url?.includes('/locations/states')) {
          setStatesFetchFailed(true);
          setManualLocationMode({ current: true, preferred: true });
        }
        toast.error(
          error.response?.data?.msg ||
            error.response?.data?.message ||
            error.message ||
            'Failed to load candidate'
        );
      } finally {
        setPageLoading(false);
        setJobsLoading(false);
        setStatesLoading(false);
      }
    };

    fetchData();
  }, [id, hydrateLocation]);

  const handleLocationChange = (type, field, value) => {
    const isCurrent = type === 'current';
    const setter = isCurrent ? setCurrentLocation : setPreferredLocation;
    const citiesList = isCurrent ? currentCities : preferredCities;

    if (field === 'state') {
      fetchCities(value, type);
      const matched = findStateMatch(states, value);
      setter({
        state: value,
        stateName: matched?.name || '',
        city: '',
        cityName: '',
        manual: false,
      });
      return;
    }

    if (field === 'city') {
      const matched = findCityMatch(citiesList, value);
      setter((prev) => ({
        ...prev,
        city: value,
        cityName: matched?.name || '',
        manual: false,
      }));
    }
  };

  const buildLocationString = (location, citiesList, useManual) => {
    if (useManual || location.manual) {
      return formatLocation(location.stateName, location.cityName);
    }
    const stateName =
      location.stateName ||
      findStateMatch(states, location.state)?.name ||
      '';
    const cityName =
      location.cityName ||
      findCityMatch(citiesList, location.city)?.name ||
      '';
    return formatLocation(stateName, cityName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let resumeUrl = formData.resume_url;

      if (resume) {
        const formDataFile = new FormData();
        formDataFile.append('file', resume);

        const uploadResponse = await axiosInstance.post(
          '/api/upload/resume',
          formDataFile,
          {
            headers: {
              ...authHeaders(),
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        resumeUrl = uploadResponse.data.url;
      }

      const dataToSend = {
        ...formData,
        job_id: formData.job_id ? parseInt(formData.job_id, 10) : null,
        created_by: state?.user?.username || formData.created_by,
        created_by_id: state?.user?.user_id || formData.created_by_id,
        job_answers: formData.job_answers || {},
        resume_url: resumeUrl,
        current_location: buildLocationString(
          currentLocation,
          currentCities,
          manualLocationMode.current || statesFetchFailed
        ),
        preferred_location: buildLocationString(
          preferredLocation,
          preferredCities,
          manualLocationMode.preferred || statesFetchFailed
        ),
      };

      await axiosInstance.put(`/api/employee/candidates/${id}`, dataToSend, {
        headers: authHeaders(),
      });

      toast.success('Candidate updated successfully');
      navigate('/employee/recruitments/candidates');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(
        error.response?.data?.msg ||
          error.response?.data?.message ||
          error.message ||
          'Failed to update candidate'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'job_id') {
      const job = jobs.find((j) => String(j.id) === String(value));
      setSelectedJob(job || null);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        job_answers: {},
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload only PDF or Word documents');
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      setResume(file);
      toast.success('Resume selected successfully');
    }
  };

  const renderLocationBlock = (type) => {
    const isCurrent = type === 'current';
    const location = isCurrent ? currentLocation : preferredLocation;
    const cities = isCurrent ? currentCities : preferredCities;
    const citiesLoading = isCurrent ? currentCitiesLoading : preferredCitiesLoading;
    const manual = manualLocationMode[type] || statesFetchFailed;
    const title = isCurrent ? 'Current Location' : 'Preferred Location';

    return (
      <div className="md:col-span-2">
        <h3 className="text-lg text-black mb-4 flex items-center dark:text-white">
          <FaMapMarkerAlt className="mr-2" />
          {title}
        </h3>
        <div className="mb-3">
          <button
            type="button"
            onClick={() =>
              setManualLocationMode((prev) => ({
                ...prev,
                [type]: !prev[type],
              }))
            }
            className="text-sm text-primary underline"
          >
            {manualLocationMode[type]
              ? 'Use dropdown selection'
              : 'Enter location manually'}
          </button>
        </div>
        {manual ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">State</label>
              <input
                type="text"
                value={location.stateName || ''}
                onChange={(e) => {
                  const setter = isCurrent ? setCurrentLocation : setPreferredLocation;
                  setter((prev) => ({
                    ...prev,
                    state: '',
                    stateName: e.target.value,
                    manual: true,
                  }));
                }}
                placeholder="Enter state"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
              />
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">City</label>
              <input
                type="text"
                value={location.cityName || ''}
                onChange={(e) => {
                  const setter = isCurrent ? setCurrentLocation : setPreferredLocation;
                  setter((prev) => ({
                    ...prev,
                    city: '',
                    cityName: e.target.value,
                    manual: true,
                  }));
                }}
                placeholder="Enter city"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">State</label>
              <select
                value={location.state || ''}
                onChange={(e) => handleLocationChange(type, 'state', e.target.value)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.iso2 || s.code || s.id} value={s.iso2 || s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2.5 block text-black dark:text-white">City</label>
              <div className="relative">
                <select
                  value={location.city || ''}
                  onChange={(e) => handleLocationChange(type, 'city', e.target.value)}
                  disabled={!location.state || citiesLoading}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={String(city.id)}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {citiesLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (pageLoading || jobsLoading || statesLoading) {
    return (
      <DefaultLayoutEmployee>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DefaultLayoutEmployee>
    );
  }

  return (
    <DefaultLayoutEmployee>
      <BreadcrumbPegawai pageName="Edit Candidate" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="p-6.5">
          <div className="mb-4.5 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Full Name <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter candidate name"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Email <span className="text-meta-1">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                required
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Phone <span className="text-meta-1">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2.5 block text-black dark:text-white">
                <FaBriefcase className="inline mr-2" />
                Job Position <span className="text-meta-1">*</span>
              </label>
              <select
                name="job_id"
                value={formData.job_id || ''}
                onChange={handleChange}
                required
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
              >
                <option value="">Select Job Position</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} - {job.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience || ''}
                onChange={handleChange}
                placeholder="Enter years of experience"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Current Company
              </label>
              <input
                type="text"
                name="current_company"
                value={formData.current_company || ''}
                onChange={handleChange}
                placeholder="Enter current company"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                <FaRupeeSign className="inline mr-1" />
                Current CTC
              </label>
              <input
                type="number"
                name="current_ctc"
                value={formData.current_ctc || ''}
                onChange={handleChange}
                placeholder="Enter current CTC"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Expected CTC
              </label>
              <input
                type="number"
                name="expected_ctc"
                value={formData.expected_ctc || ''}
                onChange={handleChange}
                placeholder="Enter expected CTC"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                Notice Period (days)
              </label>
              <input
                type="number"
                name="notice_period"
                value={formData.notice_period || ''}
                onChange={handleChange}
                placeholder="Enter notice period"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
              />
            </div>

            {renderLocationBlock('current')}
            {renderLocationBlock('preferred')}

            <div>
              <label className="mb-2.5 block text-black dark:text-white">Source</label>
              <select
                name="source"
                value={formData.source || ''}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
              >
                <option value="">Select Source</option>
                {sourceOptions.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            {formData.source === 'Referral' && (
              <div>
                <label className="mb-2.5 block text-black dark:text-white">
                  Referred By
                </label>
                <input
                  type="text"
                  name="referred_by"
                  value={formData.referred_by || ''}
                  onChange={handleChange}
                  placeholder="Enter referrer name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                />
              </div>
            )}

            {selectedJob?.questions?.length > 0 && (
              <div className="md:col-span-2 mt-4 border-t border-stroke pt-4">
                <h4 className="font-semibold mb-4">Job-Specific Questions:</h4>
                <div className="space-y-4">
                  {selectedJob.questions.map((question, index) => (
                    <div
                      key={index}
                      className="border border-stroke rounded-lg p-4 bg-white dark:bg-boxdark"
                    >
                      <label className="block text-black dark:text-white mb-2">
                        {question} <span className="text-meta-1">*</span>
                      </label>
                      <textarea
                        value={formData.job_answers?.[question] || ''}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            job_answers: {
                              ...prev.job_answers,
                              [question]: e.target.value,
                            },
                          }));
                        }}
                        required
                        rows="3"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 font-medium outline-none transition focus:border-primary active:border-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="mb-2.5 block text-black dark:text-white">
                <FaFileUpload className="inline mr-2" />
                Resume
              </label>
              <div className="flex flex-col gap-4">
                {formData.resume_url && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Current Resume:</span>
                    <a
                      href={formData.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (formData.resume_url.startsWith('http')) {
                          window.open(formData.resume_url, '_blank');
                        } else {
                          toast.error('Invalid resume URL');
                        }
                      }}
                    >
                      <FaFileUpload /> View Current Resume
                    </a>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
                />
                {resume && (
                  <p className="mt-2 text-sm text-success">
                    Selected new file: {resume.name}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, DOC, DOCX (Max size: 5MB)
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-black dark:text-white">
                <FaUser className="inline mr-2" />
                Created By
              </label>
              <input
                type="text"
                value={formData.created_by || 'N/A'}
                disabled
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-form-strokedark dark:bg-form-input"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2.5 block text-black dark:text-white">Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={6}
              placeholder="Enter any additional notes"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
            />
          </div>

          <div className="flex gap-4 justify-end mt-6">
            <button
              type="button"
              onClick={() => navigate('/employee/recruitments/candidates')}
              className="flex items-center justify-center gap-2 rounded border border-stroke py-3 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90"
            >
              <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayoutEmployee>
  );
};

export default CandidateEdit;
