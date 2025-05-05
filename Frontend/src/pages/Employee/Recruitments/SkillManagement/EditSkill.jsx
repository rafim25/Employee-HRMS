import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DefaultLayoutEmployee from '../../../../layout/DefaultLayoutPegawai';
import { BreadcrumbPegawai } from '../../../../components';
import { FaTools, FaSave, FaTimes, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../../../../context/AuthContext';
import axiosInstance from '../../../../services/api';

const EmployeeEditSkill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    updated_by: authState?.user?.username || '',
    updated_by_id: authState?.user?.user_id || null
  });

  useEffect(() => {
    if (id) {
      fetchSkillDetails();
    }
  }, [id]);

  const fetchSkillDetails = async () => {
    try {
      const response = await axiosInstance.get(`/api/skills/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setFormData({
        ...response.data,
        updated_by: authState?.user?.username,
        updated_by_id: authState?.user?.user_id
      });
    } catch (error) {
      toast.error('Failed to load skill details');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillData = {
        ...formData,
        updated_by: authState?.user?.username,
        updated_by_id: authState?.user?.user_id
      };

      const response = await axiosInstance.patch(`/api/skills/${id}`, skillData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Skill updated successfully');
      navigate('/employee/recruitments/skill-management');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update skill');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      const response = await axiosInstance.delete(`/api/skills/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Skill deleted successfully');
      navigate('/employee/recruitments/skill-management');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete skill');
      console.error(error);
    }
  };

  return (
    <DefaultLayoutEmployee>
      <BreadcrumbPegawai pageName="Edit Skill" icon={FaTools} />

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="p-6.5">
          {/* Skill Details Section */}
          <div className="mb-6 rounded-sm border border-stroke py-4 px-6.5 dark:border-strokedark">
            <div className="flex items-center gap-3 mb-4">
              <FaTools className="text-xl text-primary" />
              <h3 className="font-medium text-black dark:text-white">
                Skill Details
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Skill Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter skill name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter skill description"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 rounded-lg border border-danger py-2 px-6 text-danger hover:bg-danger hover:text-white"
            >
              <FaTrash />
              Delete Skill
            </button>
            <button
              type="button"
              onClick={() => navigate('/employee/recruitments/skill-management')}
              className="flex items-center justify-center gap-2 rounded-lg border border-stroke py-2 px-6 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-boxdark"
            >
              <FaTimes />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2 px-6 text-white hover:bg-opacity-90"
            >
              <FaSave />
              {loading ? 'Saving...' : 'Update Skill'}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayoutEmployee>
  );
};

export default EmployeeEditSkill; 