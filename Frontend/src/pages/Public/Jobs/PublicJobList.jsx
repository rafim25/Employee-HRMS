import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PublicJobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/public/jobs');
        if (!response.ok) throw new Error('Failed to fetch jobs');
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Current Job Openings
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Join our team and make a difference
        </p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto block rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/careers/jobs/${job.id}`}
              className="block bg-white dark:bg-boxdark rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {job.title}
              </h2>
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <FaBriefcase className="mr-2" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  <span>Apply by {format(new Date(job.deadline), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No jobs found matching your search criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicJobList; 