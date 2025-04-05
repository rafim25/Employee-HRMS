import { useState, useEffect, useCallback } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from "react-router-dom";
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus, FaCode, FaTools } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { useAuth } from '../../../../context/AuthContext';
import { fetchSkills, deleteSkill } from '../../../../context/actions/skillActions';
import { toast } from 'react-hot-toast';
import Pagination from '../../../../components/molecules/Pagination/Pagination';

const ITEMS_PER_PAGE = 6;

const SkillList = () => {
    const { state, dispatch } = useAuth();
    const { skills, loading } = state;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState(null);

    const loadSkills = useCallback(async () => {
        try {
            await fetchSkills(dispatch);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch skills';
            toast.error(errorMessage);
        }
    }, [dispatch]);

    useEffect(() => {
        loadSkills();
    }, [loadSkills]);

    const filteredSkills = skills?.filter((skill) => {
        return (skill?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    }) || [];

    const totalPages = Math.ceil(filteredSkills.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedSkills = filteredSkills.slice(startIndex, endIndex);

    const handleDelete = async (skillId) => {
        setSkillToDelete(skillId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteSkill(dispatch, skillToDelete);
            toast.success('Skill deleted successfully');
            loadSkills();
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Failed to delete skill';
            toast.error(errorMessage);
        } finally {
            setShowDeleteModal(false);
            setSkillToDelete(null);
        }
    };

    if (loading) {
        return (
            <DefaultLayoutAdmin>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DefaultLayoutAdmin>
        );
    }

    return (
        <DefaultLayoutAdmin>
            <BreadcrumbAdmin pageName='Skill Management' icon={FaCode} backButton={false} />

            {/* Main Container with better spacing */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                {/* Header Section with Actions */}
                <div className="p-4 md:p-6 xl:p-7.5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                        {/* Add Skill Button */}
                        <div className="w-full sm:w-auto">
                            <Link to="/admin/recruitments/skill-management/form-skill">
                                <ButtonOne className="w-full sm:w-auto">
                                    <span className="mr-2">Add New Skill</span>
                                    <FaPlus />
                                </ButtonOne>
                            </Link>
                        </div>

                        {/* Search Box with improved styling */}
                        <div className="w-full sm:w-72">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search skills..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-3 pl-12 pr-4 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                                    <BiSearch className="h-5 w-5 fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary" />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table Container with improved spacing */}
                    <div className="rounded-lg border border-stroke dark:border-strokedark">
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 dark:bg-meta-4">
                                        <th className="text-left py-4.5 px-4 font-medium text-black dark:text-white xl:pl-11">
                                            ID
                                        </th>
                                        <th className="text-left py-4.5 px-4 font-medium text-black dark:text-white">
                                            Name
                                        </th>
                                        <th className="text-left py-4.5 px-4 font-medium text-black dark:text-white">
                                            Description
                                        </th>
                                        <th className="text-left py-4.5 px-4 font-medium text-black dark:text-white">
                                            Status
                                        </th>
                                        <th className="text-left py-4.5 px-4 font-medium text-black dark:text-white">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedSkills.map((skill) => (
                                        <tr key={skill.id} className="hover:bg-gray-1 dark:hover:bg-meta-4/30 transition-colors">
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11 dark:border-strokedark">
                                                <h5 className="font-medium text-black dark:text-white">
                                                    {skill.id}
                                                </h5>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white font-medium">
                                                    {skill.name}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">
                                                    {skill.description || '-'}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${skill.status === 'active'
                                                    ? 'text-success bg-success'
                                                    : 'text-danger bg-danger'
                                                    }`}>
                                                    {skill.status}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex items-center gap-3.5">
                                                    <Link to={`/admin/recruitments/skill-management/edit/${skill.id}`}>
                                                        <button className="hover:text-primary">
                                                            <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(skill.id)}
                                                        className="hover:text-danger"
                                                    >
                                                        <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination with improved spacing */}
                        <div className="p-4 md:p-6">
                            <Pagination
                                currentPage={currentPage}
                                totalItems={filteredSkills.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={setCurrentPage}
                                showingText="Showing"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={confirmDelete}
                    title="Delete Skill"
                    message="Are you sure you want to delete this skill? This action cannot be undone."
                />
            )}
        </DefaultLayoutAdmin>
    );
};

export default SkillList; 