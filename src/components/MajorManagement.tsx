import React, { useState, useEffect } from 'react';
import { adminMajorServices } from '../services/majorServices';
import { MajorFormData } from '../types/major';
import CreateMajorModal from './modals/CreateMajorModal';
import MajorDetailModal from './modals/MajorDetailModal';
import EditMajorModal from './modals/EditMajorModal';
import ConfirmModal from './modals/ConfirmModal';
import { toast } from 'react-toastify';
import { Search, Filter, RefreshCw, GraduationCap, Building2, BookOpen, Users, Eye, Edit, Trash2 } from 'lucide-react';

const MajorManagement: React.FC = () => {
    const [majors, setMajors] = useState<MajorFormData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedMajor, setSelectedMajor] = useState<MajorFormData | null>(null);
    const [editingMajor, setEditingMajor] = useState<MajorFormData | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [majorToDelete, setMajorToDelete] = useState<MajorFormData | null>(null);

    const departments = [
        'Công nghệ thông tin',
        'Quản trị kinh doanh',
        'Công nghệ truyền thông',
        'Luật',
        'Ngôn ngữ Anh',
        'Ngôn ngữ Trung Quốc',
        'Ngôn ngữ Nhật',
        'Ngôn ngữ Hàn Quốc'
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            if (searchTerm) {
                setSearchLoading(true);
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            setSearchLoading(false);
        };
    }, [searchTerm]);

    useEffect(() => {
        fetchMajors();
    }, [currentPage, debouncedSearchTerm, selectedDepartment]);

    const fetchMajors = async () => {
        try {
            if (!initialLoad) {
                setLoading(true);
            }
            setError(null);
            const params = {
                page: currentPage,
                limit: 10,
                search: debouncedSearchTerm || undefined,
                department: selectedDepartment || undefined,
                sortBy: 'createdAt',
                sortOrder: 'desc' as const
            };

            const response = await adminMajorServices.getAllMajors(params);
            
            if (response.majors && Array.isArray(response.majors)) {
                setMajors(response.majors);
                setTotalPages(response.totalPages || Math.ceil(response.totalItems / 10) || 1);
            } else {
                throw new Error('Invalid data format received from server');
            }
        } catch (err: any) {
            console.error('Error fetching majors:', err);
            setError(`Lỗi khi tải danh sách ngành học: ${err.message}`);
            setMajors([]);
        } finally {
            setLoading(false);
            setSearchLoading(false);
            setInitialLoad(false);
        }
    };

    const handleCreateMajor = async (majorData: MajorFormData) => {
        try {
            // Kiểm tra các trường bắt buộc
            if (!majorData.name?.trim()) {
                toast.error('Vui lòng nhập tên ngành học');
                return;
            }
            
            if (!majorData.department?.trim()) {
                toast.error('Vui lòng chọn khoa/viện');
                return;
            }
            
            if (!majorData.code?.trim()) {
                toast.error('Vui lòng nhập mã ngành học');
                return;
            }
            
            if (!majorData.totalCredits || isNaN(Number(majorData.totalCredits)) || Number(majorData.totalCredits) <= 0) {
                toast.error('Vui lòng nhập tổng số tín chỉ hợp lệ');
                return;
            }
            
            if (!majorData.admissionCriteria?.trim()) {
                toast.error('Vui lòng nhập tiêu chí tuyển sinh');
                return;
            }
            
            // Kiểm tra tuition
            if (!majorData.tuition || 
                !majorData.tuition.firstSem || 
                !majorData.tuition.midSem || 
                !majorData.tuition.lastSem) {
                toast.error('Vui lòng nhập đầy đủ thông tin học phí');
                return;
            }

            const defaultProgramStructure = {
                preparation: {
                    duration: "",
                    objectives: [],
                    courses: []
                },
                basic: {
                    duration: "",
                    objectives: [],
                    courses: []
                },
                ojt: {
                    duration: "",
                    objectives: []
                },
                specialization: {
                    duration: "",
                    objectives: [],
                    courses: []
                },
                graduation: {
                    duration: "Học kỳ cuối",
                    objectives: [],
                    options: []
                }
            };

            // Và gán vào majorData nếu chưa có
            if (!majorData.programStructure) {
                majorData.programStructure = defaultProgramStructure;
            }

            const formData = adminMajorServices.createMajorFormData(majorData);
            await adminMajorServices.createMajor(formData);
            setShowCreateModal(false);
            fetchMajors();
            toast.success('Tạo ngành học thành công!');
        } catch (err: any) {
            console.error('Error creating major:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
            toast.error('Lỗi khi tạo ngành học: ' + errorMessage);
        }
    };

    const handleUpdateMajor = async (majorData: MajorFormData) => {
        if (!editingMajor?._id) {
            toast.error('Không tìm thấy ID ngành học để cập nhật');
            return;
        }
        
        try {
            // Validate required fields
            if (!majorData.name?.trim()) {
                toast.error('Vui lòng nhập tên ngành học');
                return;
            }
            
            if (!majorData.code?.trim()) {
                toast.error('Vui lòng nhập mã ngành học');
                return;
            }
            
            if (!majorData.department?.trim()) {
                toast.error('Vui lòng chọn khoa/viện');
                return;
            }
            
            if (!majorData.admissionCriteria?.trim()) {
                toast.error('Vui lòng nhập tiêu chí tuyển sinh');
                return;
            }

            // Ensure availableAt is properly formatted - initialize as empty array if missing
            if (!majorData.availableAt) {
                majorData.availableAt = [];
            }

            setLoading(true);
            const formData = adminMajorServices.createMajorFormData(majorData);
            const response = await adminMajorServices.updateMajor(editingMajor._id, formData);
            
            if (response) {
                setEditingMajor(null);
                setShowEditModal(false);
                await fetchMajors();
                toast.success('Cập nhật ngành học thành công!');
            }
        } catch (err: any) {
            console.error('Error updating major:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Unknown error';
            toast.error(`Lỗi khi cập nhật ngành học: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMajor = async (majorId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa ngành học này?')) return;
        
        try {
            await adminMajorServices.deleteMajor(majorId);
            fetchMajors();
            toast.success('Xóa ngành học thành công!');
        } catch (err: any) {
            console.error('Error deleting major:', err);
            toast.error('Lỗi khi xóa ngành học: ' + (err.message || 'Unknown error'));
        }
    };

    const handleViewDetails = async (major: MajorFormData) => {
        try {
            if (major._id) {
                const response = await adminMajorServices.getMajorById(major._id);
                setSelectedMajor(response);
            } else {
                setSelectedMajor(major);
            }
            setShowDetailModal(true);
        } catch (err: any) {
            console.error('Error fetching major details:', err);
            toast.error('Lỗi khi tải chi tiết ngành học');
        }
    };

    const handleEditMajor = (major: MajorFormData) => {
        setEditingMajor(major);
        setShowEditModal(true);
    };

    const handleDeleteClick = (major: MajorFormData) => {
        setMajorToDelete(major);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!majorToDelete?._id) return;
        
        try {
            await adminMajorServices.deleteMajor(majorToDelete._id);
            fetchMajors();
            toast.success('Xóa ngành học thành công!');
            setShowDeleteConfirm(false);
            setMajorToDelete(null);
        } catch (err: any) {
            console.error('Error deleting major:', err);
            toast.error('Lỗi khi xóa ngành học: ' + (err.message || 'Unknown error'));
        }
    };

    const LoadingSkeleton = () => (
        <>
            {[1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse border-b border-gray-200">
                    <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gray-100"></div>
                            <div className="flex-1">
                                <div className="h-5 w-48 bg-gray-100 rounded mb-2"></div>
                                <div className="h-3 w-32 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                        <div className="inline-flex">
                            <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
                        </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                        <div className="h-4 w-24 bg-gray-100 rounded mx-auto"></div>
                    </td>
                    <td className="py-5 px-4 text-center">
                        <div className="h-4 w-12 bg-gray-100 rounded mx-auto"></div>
                    </td>
                    <td className="py-5 px-4">
                        <div className="flex items-center justify-center gap-1">
                            <div className="h-9 w-9 bg-gray-100 rounded-lg"></div>
                            <div className="h-9 w-9 bg-gray-100 rounded-lg"></div>
                            <div className="h-9 w-9 bg-gray-100 rounded-lg"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );

    if (initialLoad) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 animate-fadeIn">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-sky-100 rounded-2xl flex items-center justify-center mr-4">
                        <GraduationCap className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-black mb-1">Quản lý Ngành học</h1>
                        <p className="text-black">Quản lý thông tin các ngành học trong hệ thống</p>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-sky-50 p-6 rounded-xl border border-sky-200 mb-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 relative">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ${searchLoading ? 'animate-spin' : ''}`} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm ngành học..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-sky-100 border border-sky-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex items-center space-x-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl px-4 py-3 border border-gray-200">
                        <label htmlFor="department-filter" className="font-medium text-black">Lọc theo khoa/viện:</label>
                        <select
                            id="department-filter"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="bg-gray-100 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer hover:bg-gray-200 font-semibold"
                        >
                            <option value="">Tất cả khoa/viện</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept} className="bg-white text-black">{dept}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                    >
                        <GraduationCap className="w-5 h-5" />
                        <span>Thêm ngành học</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold text-blue-900 mb-1">{majors.length}</div>
                                <div className="text-blue-700">Tổng số ngành</div>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                        </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-bold text-purple-900 mb-1">{departments.length}</div>
                            <div className="text-purple-700">Số khoa/viện</div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-inner">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-bold text-indigo-900 mb-1">
                                {majors.reduce((sum, major) => sum + (major.totalCredits || 0), 0)}
                            </div>
                            <div className="text-indigo-700">Tổng tín chỉ</div>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-inner">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Major List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="w-2/5 px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <GraduationCap className="w-4 h-4 mr-2 text-indigo-600" />
                                        Ngành học
                                    </div>
                                </th>
                                <th className="w-1/6 px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <BookOpen className="w-4 h-4 mr-2 text-emerald-600" />
                                        Mã ngành
                                    </div>
                                </th>
                                <th className="w-1/6 px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <Building2 className="w-4 h-4 mr-2 text-purple-600" />
                                        Khoa/Viện
                                    </div>
                                </th>
                                <th className="w-1/12 px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <BookOpen className="w-4 h-4 mr-2 text-rose-600" />
                                        Tín chỉ
                                    </div>
                                </th>
                                <th className="w-1/6 px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <LoadingSkeleton />
                            ) : (
                                Array.isArray(majors) && majors.length > 0 ? majors.map((major) => (
                                    <tr key={major?._id || major?.code || Math.random()} className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                                        <td className="w-2/5 px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {(major.majorImage || major.imageUrl) ? (
                                                    <img
                                                        src={major.imageUrl || (major.majorImage instanceof File ? URL.createObjectURL(major.majorImage) : '')}
                                                        alt={major.name}
                                                        className="w-12 h-12 object-cover rounded-xl border border-indigo-200"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                                                        <GraduationCap className="w-6 h-6 text-indigo-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-black font-semibold text-lg mb-1">{major?.name || 'N/A'}</div>
                                                    <div className="text-gray-600 text-sm line-clamp-1">{major?.shortDescription || 'Chưa có mô tả'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="w-1/6 px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-200">
                                                {major?.code || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="w-1/6 px-6 py-4">
                                            <div className="text-gray-900 font-medium">{major?.department || 'N/A'}</div>
                                        </td>
                                        <td className="w-1/12 px-6 py-4">
                                            <div className="inline-flex items-center gap-1">
                                                <BookOpen className="w-4 h-4 text-rose-600" />
                                                <span className="text-gray-900 font-medium">{major?.totalCredits || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="w-1/6 px-6 py-4">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleViewDetails(major)}
                                                    className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditMajor(major)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => major?._id && handleDeleteClick(major)}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : null
                            )}
                        </tbody>
                    </table>

                    {(!Array.isArray(majors) || majors.length === 0) && !loading && (
                        <div className="text-center py-8">
                            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 text-lg mb-2">
                                {searchTerm || selectedDepartment
                                    ? 'Không tìm thấy ngành học nào'
                                    : 'Chưa có ngành học nào'}
                            </p>
                            <p className="text-gray-500">
                                {searchTerm || selectedDepartment
                                    ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                                    : 'Thêm ngành học đầu tiên để bắt đầu'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2 border border-gray-200 mt-6">
                    <div className="text-gray-600">
                        Hiển thị {majors.length} ngành học
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center rounded-xl px-4 py-3 ${
                                currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            <span className="sr-only">Trang trước</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`relative inline-flex items-center px-4 py-3 text-sm font-semibold rounded-xl ${
                                        currentPage === pageNum
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center rounded-xl px-4 py-3 ${
                                currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            <span className="sr-only">Trang sau</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            {showCreateModal && (
                <CreateMajorModal
                    isOpen={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingMajor(null);
                    }}
                    onSubmit={handleCreateMajor}
                    initialData={undefined}
                    isEdit={false}
                />
            )}

            {showEditModal && editingMajor && (
                <EditMajorModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingMajor(null);
                    }}
                    onSubmit={handleUpdateMajor}
                    major={editingMajor}
                />
            )}

            {showDetailModal && selectedMajor && (
                <MajorDetailModal
                    isOpen={showDetailModal}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedMajor(null);
                    }}
                    major={selectedMajor}
                    onEdit={() => {
                        setShowDetailModal(false);
                        handleEditMajor(selectedMajor);
                    }}
                    onDelete={() => {
                        if (selectedMajor._id) {
                            setShowDetailModal(false);
                            handleDeleteClick(selectedMajor);
                        }
                    }}
                />
            )}

            {showDeleteConfirm && majorToDelete && (
                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setMajorToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa ngành học"
                    message={`Bạn có chắc chắn muốn xóa ngành học "${majorToDelete.name}" không? Hành động này không thể hoàn tác.`}
                />
            )}
        </div>
    );
};

export default MajorManagement;
