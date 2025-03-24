import { useState, useEffect, useCallback } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from "react-router-dom";
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { useAuth } from '../../../../context/AuthContext';
import { fetchSkills, deleteSkill } from '../../../../context/actions/skillActions';
import { toast } from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

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
            <BreadcrumbAdmin pageName='Skill Management' />

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="flex flex-wrap items-center justify-between gap-4 md:gap-6 xl:gap-8">
                    <div className="flex gap-3">
                        <Link to="/admin/recruitments/skill-management/form-skill">
                            <ButtonOne>
                                <span>Add New Skill</span>
                                <span><FaPlus /></span>
                            </ButtonOne>
                        </Link>
                    </div>
                    <div className="relative flex w-full max-w-45 sm:w-72">
                        <input
                            type="text"
                            placeholder="Search skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            <BiSearch className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary" />
                        </span>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                    ID
                                </th>
                                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                                    Name
                                </th>
                                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                                    Description
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Status
                                </th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSkills.map((skill) => (
                                <tr key={skill.id}>
                                    <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11 dark:border-strokedark">
                                        <h5 className="font-medium text-black dark:text-white">
                                            {skill.id}
                                        </h5>
                                    </td>
                                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                        <p className="text-black dark:text-white">
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
                                        <div className="flex items-center space-x-3.5">
                                            <Link to={`/admin/recruitments/skill-management/edit/${skill.id}`}>
                                                <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                            </Link>
                                            <button onClick={() => handleDelete(skill.id)}>
                                                <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-body dark:text-bodydark">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredSkills.length)} of {filteredSkills.length} skills
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="flex items-center justify-center rounded bg-primary py-2 px-4 text-white hover:bg-opacity-90 disabled:opacity-50"
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <button
                            className="flex items-center justify-center rounded bg-primary py-2 px-4 text-white hover:bg-opacity-90 disabled:opacity-50"
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
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