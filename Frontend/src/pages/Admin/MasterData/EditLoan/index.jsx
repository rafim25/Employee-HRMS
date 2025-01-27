import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { updateLoan } from '../../../../context/actions/loanActions';
import { api } from '../../../../services/api';
import { LOAN_ENDPOINTS } from '../../../../constants/apiEndpoints';
import toast from 'react-hot-toast';
import { BreadcrumbAdmin } from '../../../../components/atoms';

const EditLoan = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { dispatch } = useAuth();
    const [loading, setLoading] = useState(false);
    const [loanData, setLoanData] = useState({
        customer_id: '',
        customer_name: '',
        loan_amount: '',
        advance_amount: '',
        status: ''
    });

    // Fetch loan data when component mounts
    useEffect(() => {
        const fetchLoanData = async () => {
            try {
                setLoading(true);
                const response = await api.get(LOAN_ENDPOINTS.DETAILS(id));
                const loan = response.data;
                setLoanData({
                    customer_id: loan.customer_id,
                    customer_name: loan.customer_name,
                    loan_amount: loan.loan_amount,
                    advance_amount: loan.advance_amount,
                    status: loan.status
                });
            } catch (error) {
                toast.error(error.response?.data?.msg || 'Failed to fetch loan details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchLoanData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoanData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateLoan(dispatch, id, loanData);
            navigate('/admin/master-data/loans');
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to update loan');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <BreadcrumbAdmin items={['Master Data', 'Loans', 'Edit Loan']} />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="max-w-full overflow-x-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Customer Name <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={loanData.customer_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Loan Amount <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="loan_amount"
                                    value={loanData.loan_amount}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Advance Amount <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="advance_amount"
                                    value={loanData.advance_amount}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-2.5 block text-black dark:text-white">
                                    Status <span className="text-meta-1">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={loanData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                >
                                    <option value="">Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                                Update Loan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditLoan; 