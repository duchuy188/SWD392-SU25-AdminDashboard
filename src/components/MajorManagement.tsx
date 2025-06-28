import React, { useState, useEffect } from 'react';
import { adminMajorServices } from '../services/majorServices';
import { MajorFormData } from '../types/major';
import CreateMajorModal from './modals/CreateMajorModal';
import MajorDetailModal from './modals/MajorDetailModal';

const MajorManagement: React.FC = () => {
    const [majors, setMajors] = useState<MajorFormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedMajor, setSelectedMajor] = useState<MajorFormData | null>(null);
    const [editingMajor, setEditingMajor] = useState<MajorFormData | null>(null);

    const departments = [
        'Công nghệ thông tin',
        'Kinh tế',
        'Kỹ thuật',
        'Y học',
        'Luật',
        'Khoa học xã hội',
        'Nghệ thuật'
    ];

    useEffect(() => {
        fetchMajors();
    }, [currentPage, searchTerm, selectedDepartment, selectedStatus]);

    useEffect(() => {
        console.log('Current majors state:', majors);
    }, [majors]);

    const fetchMajors = async () => {
        try {
            setLoading(true);
            setError(null);
            const params = {
                page: currentPage,
                limit: 10,
                search: searchTerm || undefined,
                department: selectedDepartment || undefined,
                status: selectedStatus === 'all' ? undefined : selectedStatus,
                sortBy: 'createdAt',
                sortOrder: 'desc' as const
            };

            console.log('Fetching majors with params:', params);
            const response = await adminMajorServices.getAllMajors(params);
            console.log('Full response:', response);
            console.log('Response data:', response.data);
            
            // Handle different possible response structures
            let majorsData = [];
            let totalCount = 0;
            
            if (response?.data) {
                if (response.data.data) {
                    // If response has nested data structure
                    majorsData = response.data.data.majors || response.data.data || [];
                    totalCount = response.data.data.total || response.data.data.totalCount || response.data.data.pagination?.total || 0;
                } else if (Array.isArray(response.data)) {
                    // If response.data is directly an array
                    majorsData = response.data;
                    totalCount = response.data.length;
                } else {
                    // If response.data has majors directly
                    majorsData = response.data.majors || [];
                    totalCount = response.data.total || response.data.totalCount || response.data.pagination?.total || 0;
                }
            }
            
            console.log('Processed majors data:', majorsData);
            console.log('Total count:', totalCount);
            console.log('Is majors data an array?', Array.isArray(majorsData));
            
            // Ensure majorsData is always an array
            if (!Array.isArray(majorsData)) {
                console.warn('majorsData is not an array, setting to empty array');
                majorsData = [];
            }
            
            setMajors(majorsData);
            setTotalPages(Math.ceil(totalCount / 10) || 1);
            setError(null);
        } catch (err: any) {
            console.error('Detailed error:', err);
            console.error('Error response:', err.response);
            
            // Use mock data as fallback for development/testing
            console.log('Using mock data as fallback');
            setMajors(mockMajors);
            setTotalPages(1);
            
            setError(`Lỗi khi tải danh sách ngành học: ${err.message || 'Unknown error'}. Đang hiển thị dữ liệu mẫu.`);
            setMajors([]); // Set to empty array on error
            console.error('Error fetching majors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMajor = async (majorData: MajorFormData) => {
        try {
            const formData = adminMajorServices.createMajorFormData(majorData);
            await adminMajorServices.createMajor(formData);
            setShowCreateModal(false);
            fetchMajors();
            alert('Tạo ngành học thành công!');
        } catch (err: any) {
            console.error('Error creating major:', err);
            alert('Lỗi khi tạo ngành học: ' + (err.message || 'Unknown error'));
        }
    };

    const handleUpdateMajor = async (majorData: MajorFormData) => {
        if (!editingMajor?.id) return;
        
        try {
            const formData = adminMajorServices.createMajorFormData(majorData);
            await adminMajorServices.updateMajor(editingMajor.id, formData);
            setEditingMajor(null);
            setShowCreateModal(false);
            fetchMajors();
            alert('Cập nhật ngành học thành công!');
        } catch (err: any) {
            console.error('Error updating major:', err);
            alert('Lỗi khi cập nhật ngành học: ' + (err.message || 'Unknown error'));
        }
    };

    const handleDeleteMajor = async (majorId: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa ngành học này?')) return;
        
        try {
            await adminMajorServices.deleteMajor(majorId);
            fetchMajors();
            alert('Xóa ngành học thành công!');
        } catch (err: any) {
            console.error('Error deleting major:', err);
            alert('Lỗi khi xóa ngành học: ' + (err.message || 'Unknown error'));
        }
    };

    const handleViewDetails = async (major: MajorFormData) => {
        try {
            if (major.id) {
                const response = await adminMajorServices.getMajorById(major.id);
                setSelectedMajor(response.data);
            } else {
                setSelectedMajor(major);
            }
            setShowDetailModal(true);
        } catch (err: any) {
            console.error('Error fetching major details:', err);
            alert('Lỗi khi tải chi tiết ngành học');
        }
    };

    const handleEditMajor = (major: MajorFormData) => {
        setEditingMajor(major);
        setShowCreateModal(true);
    };

    const getStatusBadge = (status?: string) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', text: 'Hoạt động' },
            inactive: { color: 'bg-gray-100 text-gray-800', text: 'Không hoạt động' },
            draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Bản nháp' }
        };
        
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    if (loading && majors.length === 0) {
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                        <input
                            type="text"
                            placeholder="Tên ngành học, mã ngành..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as any)}
                            aria-label="Chọn trạng thái"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                            <option value="draft">Bản nháp</option>
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
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(majors) && majors.length > 0 ? majors.map((major) => (
                                <tr key={major?.id || major?.code || Math.random()} className="hover:bg-gray-50">
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(major?.status)}
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
                                                onClick={() => major?.id && handleDeleteMajor(major.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : null}
                        </tbody>
                    </table>
                </div>

                {(!Array.isArray(majors) || majors.length === 0) && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            {!Array.isArray(majors) ? 'Dữ liệu không hợp lệ' : 'Không có ngành học nào được tìm thấy'}
                        </p>
                        {!Array.isArray(majors) && (
                            <p className="text-red-500 text-sm mt-2">
                                Debug: majors type = {typeof majors}, majors = {JSON.stringify(majors)}
                            </p>
                        )}
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
                    onSubmit={editingMajor ? handleUpdateMajor : handleCreateMajor}
                    initialData={editingMajor || undefined}
                    isEdit={!!editingMajor}
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
                        if (selectedMajor.id) {
                            setShowDetailModal(false);
                            handleDeleteMajor(selectedMajor.id);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default MajorManagement;
