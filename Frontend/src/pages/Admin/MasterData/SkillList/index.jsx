import { useState, useEffect, useCallback } from 'react';
import DefaultLayoutAdmin from '../../../../layout/DefaultLayoutAdmin';
import { Link } from "react-router-dom";
import { BreadcrumbAdmin, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus, FaFileExcel } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { useAuth } from '../../../../context/AuthContext';
import { fetchSkills, deleteSkill } from '../../../../context/actions/skillActions';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 5;

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

    const handleDownloadExcel = () => {
        try {
            const skillsForExcel = filteredSkills.map(skill => ({
                'Skill ID': skill?.skill_id || 'N/A',
                'Name': skill?.name || 'N/A',
                'Description': skill?.description || 'N/A',
                'Status': skill?.status || 'N/A',
            }));

            const ws = XLSX.utils.json_to_sheet(skillsForExcel);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Skills');
            XLSX.writeFile(wb, 'skills_list.xlsx');

            toast.success('Excel file downloaded successfully');
        } catch (error) {
            console.error('Error generating Excel:', error);
            toast.error('Failed to generate Excel file');
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
            <BreadcrumbAdmin pageName='Skill List' />

            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-6">
                <div className="flex items-center gap-3 flex-1 justify-between">
                    <Link to="/admin/master-data/skill-list/form-skill">
                        <ButtonOne>
                            <span>Add Skill</span>
                            <span><FaPlus /></span>
                        </ButtonOne>
                    </Link>

                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-10 pr-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            <BiSearch className="text-xl" />
                        </span>

                        <button
                            onClick={handleDownloadExcel}
                            disabled={filteredSkills.length === 0}
                            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-success py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaFileExcel className="text-lg" />
                            Download Excel
                        </button>
                    </div>
                </div>
            </div>

            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
                <div className='max-w-full overflow-x-auto py-4'>
                    <table className='w-full table-auto'>
                        <thead>
                            <tr className='bg-gray-2 text-left dark:bg-meta-4'>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Skill ID</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Name</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Description</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Status</th>
                                <th className='py-4 px-4 font-medium text-black dark:text-white'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSkills.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">No skills found</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500">
                                                {searchTerm ? 'Try adjusting your search to find what you\'re looking for.' : 'Get started by adding your first skill.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedSkills.map((skill) => (
                                    <tr key={skill.skill_id}>
                                        <td className='border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            {skill.skill_id}
                                        </td>
                                        <td className='border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            {skill.name}
                                        </td>
                                        <td className='border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            {skill.description}
                                        </td>
                                        <td className='border-b text-black border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            {skill.status}
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 dark:border-strokedark'>
                                            <div className='flex items-center space-x-3.5'>
                                                <Link to={`/admin/master-data/skill-list/edit/${skill.skill_id}`}>
                                                    <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                                </Link>
                                                <button onClick={() => handleDelete(skill.skill_id)}>
                                                    <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className='flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between'>
                    <div className='flex items-center space-x-2'>
                        <span className='text-gray-5 dark:text-gray-4 text-sm py-4'>
                            {paginatedSkills.length > 0 ? (
                                `Showing ${startIndex + 1}-${Math.min(endIndex, filteredSkills.length)} of ${filteredSkills.length} Skills`
                            ) : (
                                'No skills to display'
                            )}
                        </span>
                    </div>
                    {paginatedSkills.length > 0 && (
                        <div className='flex space-x-2 py-4'>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className='py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50'
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`py-2 px-4 rounded-lg border ${currentPage === i + 1 ? 'bg-primary text-white' : 'border-gray-2 text-black dark:bg-transparent bg-gray font-medium dark:border-strokedark dark:text-white'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className='py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50'
                            >
                                Next
                            </button>
                        </div>
                    )}
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