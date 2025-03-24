import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaRegClock, FaEllipsisV, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { format, isValid, parseISO } from 'date-fns';

const JobCard = ({ job, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const actionMenuRef = useRef(null);

  // Handle clicks outside the action menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatSalary = (min, max) => {
    return `CTC: ${min} - ${max} LPA`;
  };

  const handleCardClick = () => {
    navigate(`/admin/recruitments/job-management/details/${job.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = parseISO(dateString);
    if (!isValid(date)) return 'Invalid date';
    try {
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white dark:bg-boxdark rounded-xl border border-stroke dark:border-strokedark p-5 
                    hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 relative">
      {/* Action Menu */}
      <div className="absolute top-4 right-4 z-20" ref={actionMenuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-full transition-colors duration-200"
        >
          <FaEllipsisV className="text-gray-500 dark:text-gray-400" />
        </button>

        {showActions && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-boxdark rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.15)] 
                         border border-stroke dark:border-strokedark overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(job.id);
                setShowActions(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors duration-200
                         flex items-center gap-2 text-sm font-medium"
            >
              <FaEdit className="text-primary" />
              <span>Edit Job</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(job.id);
                setShowActions(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-meta-4 transition-colors duration-200
                         flex items-center gap-2 text-sm font-medium text-danger border-t border-stroke dark:border-strokedark"
            >
              <FaTrashAlt className="text-danger" />
              <span>Delete Job</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div onClick={handleCardClick} className="cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-white line-clamp-1">
            {job.title}
          </h3>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FaBriefcase className="mr-2 text-primary" />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FaMapMarkerAlt className="mr-2 text-primary" />
            <span>{job.city}, {job.state}</span>
          </div>
          <div className="flex items-center text-sm text-success font-medium">
            <span>{formatSalary(job.minSalary, job.maxSalary)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium"
            >
              {skill}
            </span>
          ))}
          {job.skills?.length > 3 && (
            <span className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-meta-4 font-medium">
              +{job.skills.length - 3}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className={`px-3 py-1 rounded-full font-medium ${job.status === 'active' ? 'bg-success/10 text-success' :
            job.status === 'draft' ? 'bg-warning/10 text-warning' :
              'bg-danger/10 text-danger'
            }`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <FaRegClock className="mr-2 text-primary" />
            <span>{formatDate(job?.deadline)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;