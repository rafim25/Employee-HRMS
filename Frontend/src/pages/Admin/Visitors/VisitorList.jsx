import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaSearch, FaFilter, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const VisitorList = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/visitors');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched visitors:', data);
      setVisitors(data);
    } catch (error) {
      console.error('Error fetching visitors:', error);
      toast.error('Failed to fetch visitors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch =
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.includes(searchTerm);

    const matchesFilter = filterStatus === 'all' || visitor.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleViewVisitor = (id) => {
    navigate(`/admin/visitors/${id}`);
  };

  const handleEditVisitor = (id) => {
    navigate(`/admin/visitors/edit/${id}`);
  };

  const handleDeleteVisitor = async (id) => {
    if (window.confirm('Are you sure you want to delete this visitor?')) {
      try {
        const response = await fetch(`/api/visitors/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        toast.success('Visitor deleted successfully');
        fetchVisitors();
      } catch (error) {
        console.error('Error deleting visitor:', error);
        toast.error('Failed to delete visitor');
      }
    }
  };

  const handleAddVisitor = () => {
    navigate('/admin/visitors/check-in');
  };

  if (loading) {
    return (
      <DefaultLayoutAdmin>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </DefaultLayoutAdmin>
    );
  }

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-black">Visitor Management</h1>
          <button
            onClick={handleAddVisitor}
            className="inline-flex items-center gap-2.5 rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90"
          >
            <FaUserPlus />
            Add New Visitor
          </button>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search visitors..."
                  className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <span className="absolute left-3 top-2.5">
                  <FaSearch className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary" />
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FaFilter className="fill-body dark:fill-bodydark" />
                <select
                  className="rounded-lg border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                  value={filterStatus}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="max-w-full overflow-x-auto py-4">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Name</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Email</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Phone</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">No visitors found</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Get started by adding your first visitor.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVisitors.map((visitor) => (
                    <tr key={visitor.id}>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {visitor.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-black dark:text-white">
                            {visitor.name}
                          </p>
                        </div>
                      </td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">{visitor.email}</td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">{visitor.phone}</td>
                      <td className="border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark">
                        <span className={`px-2 inline-flex text-md leading-5 rounded-full ${visitor.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {visitor.status}
                        </span>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button onClick={() => handleViewVisitor(visitor.id)}>
                            <FaEye className="text-success text-xl hover:text-black dark:hover:text-white" />
                          </button>
                          <button onClick={() => handleEditVisitor(visitor.id)}>
                            <FaEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                          </button>
                          <button onClick={() => handleDeleteVisitor(visitor.id)}>
                            <FaTrash className="text-danger text-xl hover:text-black dark:hover:text-white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default VisitorList; 