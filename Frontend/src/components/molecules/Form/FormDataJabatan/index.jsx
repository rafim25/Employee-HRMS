import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { BreadcrumbAdmin, ButtonOne, ButtonTwo, ButtonThree } from '../../..';
import { useAuth } from '../../../../context/AuthContext';
import { api } from '../../../../services/api';
import { LOAN_ENDPOINTS } from '../../../../constants/apiEndpoints';

const FormLoan = () => {
    const navigate = useNavigate();
    const { state } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        loan_id: generateLoanId(), // Auto-generated loan ID
        customer_id: '',
        customer_name: '',
        loan_amount: '',
        remaining_balance: '',
        status: 'active'
    });

    // Function to generate a unique loan ID
    function generateLoanId() {
        const prefix = 'LN';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }

    // Fetch customers on component mount
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await api.get('/users');
                setCustomers(response.data);
            } catch (error) {
                toast.error('Failed to fetch customers');
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, []);

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
        const loadingToast = toast.loading('Creating loan...');
        
        try {
            // Set remaining balance equal to loan amount for new loans
            const loanData = {
                ...formData,
                remaining_balance: formData.loan_amount,
                status: 'active'
            };

            const response = await api.post(LOAN_ENDPOINTS.CREATE, loanData);
            
            toast.success('Loan created successfully', {
                id: loadingToast,
            });
            
            navigate('/admin/master-data/data-jabatan');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create loan', {
                id: loadingToast,
            });
        }
    };

    // Handle form reset
    const handleReset = () => {
        setFormData({
            loan_id: generateLoanId(), // Generate new loan ID on reset
            customer_id: '',
            customer_name: '',
            loan_amount: '',
            remaining_balance: '',
            status: 'active'
        });
    };

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Create New Loan' />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Loan Details
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className='p-6.5'>
                                {/* Loan ID Display */}
                                <div className='mb-4.5'>
                                    <label className='mb-2.5 block text-black dark:text-white'>
                                        Loan ID
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
                                        Loan Amount <span className='text-meta-1'>*</span>
                                    </label>
                                    <input
                                        type='number'
                                        placeholder='Enter loan amount'
                                        value={formData.loan_amount}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            loan_amount: e.target.value
                                        })}
                                        className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        required
                                    />
                                </div>

                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <ButtonOne type="submit">
                                        <span>Save</span>
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

export default FormLoan;