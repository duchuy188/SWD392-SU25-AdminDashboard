import React, { useState, useEffect, useCallback } from 'react';
import { adminMajorServices } from '../services/majorServices';
import { MajorFormData } from '../types/major';
import CreateMajorModal from './modals/CreateMajorModal';
import MajorDetailModal from './modals/MajorDetailModal';
import EditMajorModal from './modals/EditMajorModal';
import { toast } from 'react-toastify';

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
                <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                            <div>
                                <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                <div className="h-3 w-32 bg-gray-200 rounded mt-2"></div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );

    if (initialLoad) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Ngành học</h1>
                <p className="text-gray-600">Quản lý thông tin các ngành học trong hệ thống</p>
            </div>

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Filters and Search */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                        <input
                            type="text"
                            placeholder="Tên ngành học, mã ngành..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => {
                                e.preventDefault();
                                setSearchTerm(e.target.value);
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Khoa/Viện</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            aria-label="Chọn khoa/viện"
                        >
                            <option value="">Tất cả khoa/viện</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                        >
                            + Thêm ngành học
                        </button>
                    </div>
                </div>
            </div>

            {/* Major List */}
            <div className="bg-white rounded-lg shadow overflow-hidden relative">
                {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ease-in-out z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngành học
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mã ngành
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khoa/Viện
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tín chỉ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <LoadingSkeleton />
                            ) : (
                                Array.isArray(majors) && majors.length > 0 ? majors.map((major) => (
                                    <tr key={major?._id || major?.code || Math.random()} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {major?.imageUrl && (
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover mr-3"
                                                        src={major.imageUrl}
                                                        alt={major?.name || 'Major image'}
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {major?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500 max-w-xs truncate">
                                                        {major?.shortDescription || ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {major?.code || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {major?.department || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {major?.totalCredits || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleViewDetails(major)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Xem
                                                </button>
                                                <button
                                                    onClick={() => handleEditMajor(major)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => major?._id && handleDeleteMajor(major._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : null
                            )}
                        </tbody>
                    </table>
                </div>

                {(!Array.isArray(majors) || majors.length === 0) && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {!Array.isArray(majors) ? 'Dữ liệu không hợp lệ' : 'Không có ngành học nào được tìm thấy'}
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                    <nav className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 border rounded-md ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Sau
                        </button>
                    </nav>
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
