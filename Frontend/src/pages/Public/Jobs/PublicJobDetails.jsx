import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaUserClock } from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const PublicJobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/public/jobs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data);
      } catch (error) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Job not found
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {job.title}
        </h1>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <FaBriefcase className="mr-2" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <FaMapMarkerAlt className="mr-2" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <FaMoneyBillWave className="mr-2" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <FaUserClock className="mr-2" />
            <span>{job.experience}</span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <div className="whitespace-pre-line">{job.description}</div>

          <h2 className="text-xl font-semibold mt-8 mb-4">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FaClock className="mr-2" />
              <span>Apply by {format(new Date(job.deadline), 'MMM dd, yyyy')}</span>
            </div>
            <Link
              to={`/careers/jobs/${job.id}/apply`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicJobDetails; 