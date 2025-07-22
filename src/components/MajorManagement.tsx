import React, { useState, useEffect } from 'react';
import { adminMajorServices } from '../services/majorServices';
import { MajorFormData } from '../types/major';
import CreateMajorModal from './modals/CreateMajorModal';
import MajorDetailModal from './modals/MajorDetailModal';
import EditMajorModal from './modals/EditMajorModal';
import { toast } from 'react-toastify';
import { Search, Filter, RefreshCw, GraduationCap, Building2, BookOpen, Users, Eye, Edit, Trash2 } from 'lucide-react';

const MajorManagement: React.FC = () => {
    const [majors, setMajors] = useState<MajorFormData[]>([]);
    const [loading, setLoading] = useState(false);
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
        }, 300);

        return () => clearTimeout(timer);
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-black mb-2">Quản lý Ngành học</h1>
                    <p className="text-gray-600">Quản lý thông tin các ngành học trong hệ thống</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm ngành học..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="text-gray-600 w-4 h-4" />
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            aria-label="Chọn khoa/viện để lọc"
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400 hover:bg-gray-100 cursor-pointer"
                        >
                            <option value="">Tất cả khoa/viện</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept} className="bg-white text-black">{dept}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
                    >
                        <GraduationCap className="w-4 h-4" />
                        Thêm ngành học
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Tổng số ngành</p>
                            <p className="text-2xl font-bold text-black">{majors.length}</p>
                        </div>
                        <GraduationCap className="w-8 h-8 text-gray-600" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Số khoa/viện</p>
                            <p className="text-2xl font-bold text-black">{departments.length}</p>
                        </div>
                        <Building2 className="w-8 h-8 text-gray-600" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Tổng tín chỉ</p>
                            <p className="text-2xl font-bold text-black">
                                {majors.reduce((sum, major) => sum + (major.totalCredits || 0), 0)}
                            </p>
                        </div>
                        <BookOpen className="w-8 h-8 text-gray-600" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Sinh viên</p>
                            <p className="text-2xl font-bold text-black">-</p>
                        </div>
                        <Users className="w-8 h-8 text-gray-600" />
                    </div>
                </div>
            </div>

            {/* Major List */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                {loading ? (
                    <div className="text-center py-8">
                        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Đang tải danh sách ngành học...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-6 text-gray-600 font-semibold">Ngành học</th>
                                    <th className="text-center py-4 px-4 text-gray-600 font-semibold">Mã ngành</th>
                                    <th className="text-center py-4 px-4 text-gray-600 font-semibold">Khoa/Viện</th>
                                    <th className="text-center py-4 px-4 text-gray-600 font-semibold">Tín chỉ</th>
                                    <th className="text-center py-4 px-4 text-gray-600 font-semibold">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <LoadingSkeleton />
                                ) : (
                                    Array.isArray(majors) && majors.length > 0 ? majors.map((major) => (
                                        <tr key={major?._id || major?.code || Math.random()} className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200">
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                                        <GraduationCap className="w-6 h-6 text-gray-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-black font-semibold text-lg mb-1">{major?.name || 'N/A'}</div>
                                                        <div className="text-gray-600 text-sm line-clamp-1">{major?.shortDescription || 'Chưa có mô tả'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4 text-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                    {major?.code || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-5 px-4 text-center">
                                                <div className="text-gray-900 font-medium">{major?.department || 'N/A'}</div>
                                            </td>
                                            <td className="py-5 px-4 text-center">
                                                <div className="inline-flex items-center gap-1">
                                                    <BookOpen className="w-4 h-4 text-gray-600" />
                                                    <span className="text-gray-900 font-medium">{major?.totalCredits || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => handleViewDetails(major)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditMajor(major)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => major?._id && handleDeleteMajor(major._id)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-xl px-4 py-2 border border-gray-200">
                    <div className="text-gray-600">
                        Hiển thị {majors.length} ngành học
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed px-2"
                        >
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-[2rem] px-2 py-1 rounded-md ${
                                    currentPage === page
                                        ? 'bg-gray-100 text-black'
                                        : 'text-gray-600 hover:text-black'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed px-2"
                        >
                            Sau
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
                            handleDeleteMajor(selectedMajor._id);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default MajorManagement;
