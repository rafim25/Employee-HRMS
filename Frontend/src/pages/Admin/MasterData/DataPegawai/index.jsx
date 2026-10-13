import { useState, useEffect, useCallback } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from "react-router-dom";
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus, FaEye, FaUpload, FaTimes, FaUsers } from 'react-icons/fa'
import { BsTrash3 } from 'react-icons/bs'
import { BiSearch } from 'react-icons/bi'
import { useAuth } from '../../../../context/AuthContext';
import { fetchUsers, deleteUser } from '../../../../context/actions/userActions';
import { toast } from 'react-hot-toast';
import { USER_ENDPOINTS } from '../../../../constants/apiEndpoints';
import DeleteConfirmationModal from '../../../../components/DeleteConfirmationModal';
import Pagination from '../../../../components/molecules/Pagination/Pagination';
import * as XLSX from 'xlsx';
import BulkExcelUploadPanel from '../../../../components/molecules/BulkExcelUploadPanel';

import { PAGE_SIZE } from '../../../../constants/pagination';
const ITEMS_PER_PAGE = PAGE_SIZE;

const CustomerData = () => {
    const { state, dispatch } = useAuth();
    const { users, loading } = state;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [showBulkUpload, setShowBulkUpload] = useState(false);

    // Memoize the fetch function
    const loadUsers = useCallback(async () => {
        try {
            await fetchUsers(dispatch);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch users';
            toast.error(errorMessage);
        }
    }, [dispatch]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // Filter users based on search and status
    const filteredUsers = users?.filter((user) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
            (user?.username?.toLowerCase() || '').includes(query) ||
            (user?.email?.toLowerCase() || '').includes(query) ||
            (user?.user_id?.toLowerCase() || '').includes(query) ||
            (user?.name?.toLowerCase() || '').includes(query) ||
            (user?.mobile_number || '').includes(searchTerm);

        const matchesStatus = !statusFilter || statusFilter === 'all' ||
            (user?.status?.toLowerCase() === statusFilter.toLowerCase());

        return matchesSearch && matchesStatus;
    }) || [];

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const handleDelete = async (userId) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteUser(dispatch, userToDelete);
            toast.success('User deleted successfully');
            loadUsers(); // Refresh the user list
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Failed to delete user';
            if (errorMessage.includes('active purchase')) {
                toast.error('Cannot delete user with active purchases. Please close or reassign all purchases first.');
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleDownloadExcel = () => {
        try {
            // Validate dates
            if (!fromDate || !toDate) {
                toast.error('Please select both From and To dates');
                return;
            }

            // Convert input dates to start and end of day
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);

            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);

            // Filter users based on search, status, and date range for Excel only
            const usersForExcel = users?.filter((user) => {
                // Parse date_joined properly
                const dateJoined = user?.date_joined ? new Date(user.date_joined.replace(' ', 'T')) : null;
                if (!dateJoined) return false;

                const matchesSearch =
                    (user?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                    (user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
                const matchesStatus = !statusFilter || statusFilter === 'all' ||
                    (user?.status?.toLowerCase() === statusFilter.toLowerCase());
                const matchesDateRange = dateJoined >= from && dateJoined <= to;

                return matchesSearch && matchesStatus && matchesDateRange;
            }) || [];

            if (usersForExcel.length === 0) {
                toast.error('No data available for the selected criteria');
                return;
            }

            // Prepare data for Excel
            const excelData = usersForExcel.map(user => ({
                'User ID': user?.user_id || 'N/A',
                'Name': user?.username || 'N/A',
                'Email': user?.email || 'N/A',
                'Gender': user?.gender || 'N/A',
                'Phone': user?.mobile_number || 'N/A',
                'Address': user?.address || 'N/A',
                'Status': user?.status || 'N/A',
                'Role': user?.role || 'N/A',
                'Date Joined': user?.date_joined ? new Date(user.date_joined.replace(' ', 'T')).toLocaleDateString() : 'N/A',
                'Permissions': user?.permissions || 'N/A'
            }));

            // Create worksheet
            const ws = XLSX.utils.json_to_sheet(excelData);

            // Set column widths
            const colWidths = [
                { wch: 15 }, // User ID
                { wch: 20 }, // Name
                { wch: 30 }, // Email
                { wch: 15 }, // Gender
                { wch: 15 }, // Phone
                { wch: 40 }, // Address
                { wch: 15 }, // Status
                { wch: 15 }, // Role
                { wch: 20 }, // Date Joined
                { wch: 20 }  // Permissions
            ];
            ws['!cols'] = colWidths;

            // Create workbook
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Customers');

            // Generate filename with date range
            const filename = `customers_${fromDate}_to_${toDate}.xlsx`;

            // Generate Excel file
            XLSX.writeFile(wb, filename);

            toast.success('Excel file downloaded successfully');
        } catch (error) {
            console.error('Error generating Excel:', error);
            toast.error('Failed to generate Excel file');
        }
    };

    // Add handlePageChange function
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const statusPills = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
    ];

    if (loading) {
        return (
            <DefaultLayoutAdmin>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
                </div>
            </DefaultLayoutAdmin>
        );
    }

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Employee Details' backButton={false} />

            <div className="app-card mb-6 p-4 md:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <Link to="/admin/master-data/data-pegawai/form-data-pegawai">
                            <ButtonOne>
                                <FaPlus />
                                Add User
                            </ButtonOne>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setShowBulkUpload(true)}
                            className="btn-navy"
                        >
                            <FaUpload />
                            Bulk Upload
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
                        <div className="flex rounded-full bg-[#0b1d36]/5 p-1">
                            {statusPills.map((pill) => {
                                const active = (statusFilter || 'all') === pill.value;
                                return (
                                    <button
                                        key={pill.value}
                                        type="button"
                                        onClick={() => setStatusFilter(pill.value)}
                                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                                            active
                                                ? 'bg-[#d4af37] text-[#0b1d36] shadow-sm'
                                                : 'text-[#0b1d36]/70 hover:text-[#0b1d36]'
                                        }`}
                                    >
                                        {pill.label}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="relative w-full sm:w-72">
                            <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#0b1d36]/50" />
                            <input
                                type="text"
                                placeholder="Search ID, name, email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-full border border-[rgba(11,29,54,0.14)] bg-white py-2.5 pl-11 pr-4 text-sm font-medium text-[#0b1d36] outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="app-card overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-[rgba(11,29,54,0.08)] px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37] text-[#0b1d36]">
                            <FaUsers />
                        </span>
                        <div>
                            <h3 className="font-semibold text-[#0b1d36]">Team directory</h3>
                            <p className="text-xs text-[#5b6b7c]">{filteredUsers.length} people match your filters</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-[#0b1d36] text-left">
                                {['User ID', 'Username', 'Email', 'Mobile', 'Status', 'Role', 'Actions'].map((heading) => (
                                    <th key={heading} className="whitespace-nowrap py-4 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-16 px-4">
                                        <p className="text-lg font-semibold text-[#0b1d36] mb-2">No employees found</p>
                                        <p className="text-sm text-[#5b6b7c]">
                                            {searchTerm || (statusFilter && statusFilter !== 'all')
                                                ? 'Try a different search or status filter.'
                                                : 'Add a user or upload a spreadsheet to get started.'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((customer) => {
                                    const isActive = (customer.status || '').toLowerCase() === 'active';
                                    const isAdmin = (customer.role || '').toLowerCase() === 'admin';
                                    return (
                                        <tr
                                            key={customer.user_id}
                                            className="group border-b border-[rgba(11,29,54,0.08)] transition-colors hover:bg-[#f4efe0]"
                                        >
                                            <td className="py-4 px-5 font-semibold text-[#0b1d36]">{customer.user_id}</td>
                                            <td className="py-4 px-5 text-[#0b1d36]">{customer.username}</td>
                                            <td className="py-4 px-5 text-[#5b6b7c]">{customer.email}</td>
                                            <td className="py-4 px-5 text-[#0b1d36]">{customer.mobile_number || '—'}</td>
                                            <td className="py-4 px-5">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        isActive
                                                            ? 'bg-[#d4af37]/20 text-[#0b1d36]'
                                                            : 'bg-[#0b1d36]/10 text-[#5b6b7c]'
                                                    }`}
                                                >
                                                    {customer.status || '—'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                        isAdmin
                                                            ? 'bg-[#0b1d36] text-[#d4af37]'
                                                            : 'bg-[#16324f]/10 text-[#0b1d36]'
                                                    }`}
                                                >
                                                    {customer.role || '—'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/admin/master-data/data-pegawai/view/${customer.user_id}`}
                                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1d36] text-[#d4af37] transition hover:bg-[#16324f]"
                                                        title="View"
                                                    >
                                                        <FaEye />
                                                    </Link>
                                                    <Link
                                                        to={`/admin/master-data/data-pegawai/edit/${customer.user_id}`}
                                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4af37] text-[#0b1d36] transition hover:bg-[#e3c356]"
                                                        title="Edit"
                                                    >
                                                        <FaRegEdit />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(customer.user_id)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-danger/10 text-danger transition hover:bg-danger hover:text-white"
                                                        title="Delete"
                                                    >
                                                        <BsTrash3 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-5">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredUsers.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={handlePageChange}
                        showingText="Showing"
                    />
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Customer"
                    message="Are you sure you want to delete this customer? This action cannot be undone."
                />
            )}

            {showBulkUpload && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#0b1d36]/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[rgba(212,175,55,0.35)] bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[rgba(11,29,54,0.08)] py-4 px-6">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">Admin</p>
                                <h3 className="font-semibold text-[#0b1d36]">Bulk Upload Users</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowBulkUpload(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1d36]/5 text-[#0b1d36] hover:bg-[#0b1d36] hover:text-white"
                                aria-label="Close bulk upload"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <BulkExcelUploadPanel
                            title="Bulk Upload Users"
                            description="Download the user template, fill the gold required columns, then upload. created_by_id is set to your user ID. Each new user is emailed their login credentials."
                            templateType="users"
                            endpoint={USER_ENDPOINTS.BULK_UPLOAD}
                            payloadKey="users"
                            extraPayload={{
                                created_by: state?.user?.username,
                                created_by_id: state?.user?.user_id,
                            }}
                            onComplete={() => {
                                loadUsers();
                            }}
                        />
                    </div>
                </div>
            )}
        </DefaultLayoutAdmin>
    );
};

export default CustomerData;