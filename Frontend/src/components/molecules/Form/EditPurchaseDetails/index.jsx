import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin } from '../../../../components/atoms';
import { ButtonOne, ButtonTwo, ButtonThree } from '../../../../components/atoms';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { USER_ENDPOINTS, LOAN_ENDPOINTS } from '../../../../constants/apiEndpoints';

const EditPurchaseDetails = () => {
    const navigate = useNavigate();
    const { loanId } = useParams();
    const { state, dispatch } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        loan_id: '',
        customer_id: '',
        customer_name: '',
        loan_amount: '',
        advance_amount: '',
        remaining_balance: '',
        status: 'active'
    });

    // Fetch loan details and customers on component mount
    useEffect(() => {
        const fetchData = async () => {
            if (!loanId) {
                toast.error('Invalid loan ID');
                navigate('/admin/master-data/data-jabatan');
                return;
            }

            setLoading(true);
            try {
                const [loanResponse, customersResponse] = await Promise.all([
                    api.get(`${LOAN_ENDPOINTS.DETAILS(loanId)}`),
                    api.get(USER_ENDPOINTS.LIST)
                ]);

                const loanData = loanResponse.data;
                setCustomers(customersResponse.data);

                setFormData({
                    loan_id: loanData.loan_id || '',
                    customer_id: loanData.customer_id || '',
                    customer_name: loanData.customer_name || '',
                    loan_amount: loanData.loan_amount || '',
                    advance_amount: loanData.advance_amount || '',
                    remaining_balance: loanData.remaining_balance || '',
                    status: loanData.status || 'active'
                });
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error(error.response?.data?.message || 'Failed to fetch data');
                navigate('/admin/master-data/data-jabatan');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [loanId, navigate]);

    // Handle customer selection
    const handleCustomerChange = (e) => {
        const selectedCustomer = customers.find(
            customer => customer.username === e.target.value
        );

        if (selectedCustomer) {
            setFormData({
                ...formData,
                customer_id: selectedCustomer.user_id,
                customer_name: selectedCustomer.username
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Updating purchase details...');
        
        try {
            const updatedData = {
                ...formData,
                remaining_balance: Number(formData.loan_amount) - Number(formData.advance_amount)
            };

            await api.put(LOAN_ENDPOINTS.UPDATE(loanId), updatedData);
            
            toast.success('Purchase details updated successfully', {
                id: loadingToast,
            });
            
            navigate('/admin/master-data/data-jabatan');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update purchase details', {
                id: loadingToast,
            });
        }
    };

    // Handle form reset
    const handleReset = async () => {
        if (!loanId) return;
        
        try {
            const response = await api.get(`${LOAN_ENDPOINTS.DETAILS(loanId)}`);
            const originalData = response.data;
            setFormData({
                loan_id: originalData.loan_id || '',
                customer_id: originalData.customer_id || '',
                customer_name: originalData.customer_name || '',
                loan_amount: originalData.loan_amount || '',
                advance_amount: originalData.advance_amount || '',
                remaining_balance: originalData.remaining_balance || '',
                status: originalData.status || 'active'
            });
        } catch (error) {
            toast.error('Failed to reset form');
        }
    };

    if (loading) {
        return (
            <DefaultLayoutAdmin>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">Loading...</div>
                </div>
            </DefaultLayoutAdmin>
        );
    }

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Edit Purchase Details' />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Edit Purchase Details
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className='p-6.5'>
                                {/* Loan ID Display */}
                                <div className='mb-4.5'>
                                    <label className='mb-2.5 block text-black dark:text-white'>
                                        Purchase ID
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.loan_id}
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        disabled
                                    />
                                </div>

                                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Customer Name <span className='text-meta-1'>*</span>
                                        </label>
                                        <select
                                            value={formData.customer_name}
                                            onChange={handleCustomerChange}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                            required
                                        >
                                            <option value="">Select Customer</option>
                                            {customers.map(customer => (
                                                <option 
                                                    key={customer.user_id} 
                                                    value={customer.username}
                                                >
                                                    {customer.username}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Customer ID
                                        </label>
                                        <input
                                            type='text'
                                            value={formData.customer_id}
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className='mb-4.5'>
                                    <label className='mb-2.5 block text-black dark:text-white'>
                                        Land Purchase Amount <span className='text-meta-1'>*</span>
                                    </label>
                                    <input
                                        type='number'
                                        placeholder='Enter purchase amount'
                                        value={formData.loan_amount}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            loan_amount: e.target.value
                                        })}
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        required
                                    />
                                </div>

                                <div className='mb-4.5'>
                                    <label className='mb-2.5 block text-black dark:text-white'>
                                        Advance Amount <span className='text-meta-1'>*</span>
                                    </label>
                                    <input
                                        type='number'
                                        placeholder='Enter advance amount'
                                        value={formData.advance_amount}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            advance_amount: e.target.value
                                        })}
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        required
                                    />
                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <ButtonOne type="submit">
                                        <span>Update</span>
                                    </ButtonOne>
                                    <ButtonTwo type="button" onClick={handleReset}>
                                        <span>Reset</span>
                                    </ButtonTwo>
                                    <Link to="/admin/master-data/data-jabatan">
                                        <ButtonThree>
                                            <span>Cancel</span>
                                        </ButtonThree>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayoutAdmin>
    );
};

export default EditPurchaseDetails; 