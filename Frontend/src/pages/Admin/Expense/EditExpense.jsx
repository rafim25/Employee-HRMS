import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DefaultLayoutAdmin from '../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../components';
import { EXPENSE_TYPES } from '../../../constants/expenseTypes';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaMoneyBillWave, FaFileUpload, FaRegCommentDots } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { MdDriveFileRenameOutline } from 'react-icons/md';

const EditExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    expenseName: '',
    amount: '',
    expenseType: '',
    comments: '',
    expenseDate: new Date().toISOString().split('T')[0],
    expenseImage: null
  });
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(`/api/expenses/${id}`);
        const expense = response.data;
        setFormData({
          expenseName: expense.expenseName,
          amount: expense.amount,
          expenseType: expense.expenseType,
          comments: expense.comments || '',
          expenseDate: new Date(expense.expenseDate || expense.createdAt).toISOString().split('T')[0],
          expenseImage: null
        });
        if (expense.expenseImage) {
          setCurrentImage(`/uploads/${expense.expenseImage}`);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.msg || 'Failed to fetch expense details';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        expenseImage: file
      }));
      setCurrentImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('expenseName', formData.expenseName);
      formDataToSend.append('amount', formData.amount);
      formDataToSend.append('expenseType', formData.expenseType);
      formDataToSend.append('comments', formData.comments);
      formDataToSend.append('expenseDate', formData.expenseDate);
      if (formData.expenseImage) {
        formDataToSend.append('expenseImage', formData.expenseImage);
      }

      await axios.put(`/api/expenses/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Expense updated successfully!');
      navigate('/admin/expense/list');
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Failed to update expense';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayoutAdmin>
      <div className="mx-auto max-w-screen-2xl p-4">
        <BreadcrumbAdmin pageName='Edit Expense' />

        <div className="flex flex-col gap-6">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-xl text-primary" />
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Edit Expense Details
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6.5">
              {error && (
                <div className="mb-4 rounded-md bg-danger/10 py-4 px-6 text-sm text-danger">
                  {error}
                </div>
              )}

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Expense Name <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="expenseName"
                      required
                      value={formData.expenseName}
                      onChange={handleChange}
                      placeholder="Enter expense name"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary pl-12"
                    />
                    <MdDriveFileRenameOutline className="absolute left-4 top-4 text-xl text-gray-500" />
                  </div>
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Amount <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amount"
                      required
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary pl-12"
                    />
                    <FaMoneyBillWave className="absolute left-4 top-4 text-xl text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Expense Date <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="expenseDate"
                      value={formData.expenseDate}
                      onChange={handleChange}
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary pl-12"
                      required
                    />
                  </div>
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Expense Type <span className="text-meta-1">*</span>
                  </label>
                  <div className="relative z-20 bg-transparent dark:bg-form-input">
                    <select
                      name="expenseType"
                      required
                      value={formData.expenseType}
                      onChange={handleChange}
                      className="relative z-20 w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary pl-12"
                    >
                      <option value="">Select Expense Type</option>
                      {EXPENSE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <BiCategory className="absolute left-4 top-4 text-xl text-gray-500" />
                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                            fill=""
                          ></path>
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Receipt/Bill Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full cursor-pointer rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary pl-12"
                  />
                  <FaFileUpload className="absolute left-4 top-4 text-xl text-gray-500" />
                </div>
                {currentImage && (
                  <div className="mt-3">
                    <img
                      src={currentImage}
                      alt="Current Receipt"
                      className="max-h-40 rounded-lg object-contain border border-stroke p-2"
                    />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block text-black dark:text-white">
                  Comments
                </label>
                <div className="relative">
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter any additional comments"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary pl-12"
                  ></textarea>
                  <FaRegCommentDots className="absolute left-4 top-4 text-xl text-gray-500" />
                </div>
              </div>

              <div className="flex flex-col md:flex-row w-full gap-3 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaMoneyBillWave className="text-lg" />
                      Update Expense
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/admin/expense/list')}
                  className="inline-flex items-center justify-center gap-2.5 rounded-md bg-danger py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayoutAdmin>
  );
};

export default EditExpense; 