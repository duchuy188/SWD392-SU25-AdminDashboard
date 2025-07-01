import React, { useState, useEffect } from 'react';
import { adminMajorServices } from '../services/majorServices';
import { MajorFormData } from '../types/major';
import CreateMajorModal from './modals/CreateMajorModal';
import MajorDetailModal from './modals/MajorDetailModal';
import EditMajorModal from './modals/EditMajorModal';
import { toast } from 'react-toastify';
import { Search, Filter, RefreshCw, GraduationCap, Building2, BookOpen, Users } from 'lucide-react';

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
                <tr key={i} className="animate-pulse border-b border-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-white/10 mr-3"></div>
                            <div>
                                <div className="h-4 w-48 bg-white/10 rounded"></div>
                                <div className="h-3 w-32 bg-white/10 rounded mt-2"></div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-20 bg-white/10 rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-32 bg-white/10 rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 w-12 bg-white/10 rounded"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                            <div className="h-4 w-12 bg-white/10 rounded"></div>
                            <div className="h-4 w-12 bg-white/10 rounded"></div>
                            <div className="h-4 w-12 bg-white/10 rounded"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );

    if (initialLoad) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Quản lý Ngành học</h1>
                    <p className="text-white/80">Quản lý thông tin các ngành học trong hệ thống</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="glass p-6 rounded-xl border border-white/20">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm ngành học..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="text-purple-300 w-4 h-4" />
                        <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            aria-label="Chọn khoa/viện để lọc"
                            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-200 appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả khoa/viện</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept} className="bg-gray-800 text-white">{dept}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="btn-primary flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
                    >
                        <GraduationCap className="w-4 h-4" />
                        Thêm ngành học
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass p-4 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/60 text-sm">Tổng số ngành</p>
                            <p className="text-2xl font-bold text-white">{majors.length}</p>
                        </div>
                        <GraduationCap className="w-8 h-8 text-blue-400" />
                    </div>
                </div>
                <div className="glass p-4 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/60 text-sm">Số khoa/viện</p>
                            <p className="text-2xl font-bold text-white">{departments.length}</p>
                        </div>
                        <Building2 className="w-8 h-8 text-purple-400" />
                    </div>
                </div>
                <div className="glass p-4 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/60 text-sm">Tổng tín chỉ</p>
                            <p className="text-2xl font-bold text-white">
                                {majors.reduce((sum, major) => sum + (major.totalCredits || 0), 0)}
                            </p>
                        </div>
                        <BookOpen className="w-8 h-8 text-green-400" />
                    </div>
                </div>
                <div className="glass p-4 rounded-xl border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/60 text-sm">Sinh viên</p>
                            <p className="text-2xl font-bold text-white">-</p>
                        </div>
                        <Users className="w-8 h-8 text-yellow-400" />
                    </div>
                </div>
            </div>

            {/* Major List */}
            <div className="glass p-6 rounded-xl border border-white/20">
                {loading ? (
                    <div className="text-center py-8">
                        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                        <p className="text-white/80">Đang tải danh sách ngành học...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-white/80 font-medium">Ngành học</th>
                                    <th className="text-left py-3 px-4 text-white/80 font-medium">Mã ngành</th>
                                    <th className="text-left py-3 px-4 text-white/80 font-medium">Khoa/Viện</th>
                                    <th className="text-left py-3 px-4 text-white/80 font-medium">Tín chỉ</th>
                                    <th className="text-right py-3 px-4 text-white/80 font-medium">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <LoadingSkeleton />
                                ) : (
                                    Array.isArray(majors) && majors.length > 0 ? majors.map((major) => (
                                        <tr key={major?._id || major?.code || Math.random()} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                                        <GraduationCap className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-medium">{major?.name || 'N/A'}</div>
                                                        <div className="text-white/60 text-sm">{major?.shortDescription || ''}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-white/80">{major?.code || 'N/A'}</td>
                                            <td className="py-4 px-4 text-white/80">{major?.department || 'N/A'}</td>
                                            <td className="py-4 px-4 text-white/80">{major?.totalCredits || 'N/A'}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetails(major)}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                                                    >
                                                        Xem
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditMajor(major)}
                                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => major?._id && handleDeleteMajor(major._id)}
                                                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400 hover:text-red-500"
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

                        {(!Array.isArray(majors) || majors.length === 0) && !loading && (
                            <div className="text-center py-8">
                                <GraduationCap className="w-12 h-12 text-white/30 mx-auto mb-4" />
                                <p className="text-white/60 text-lg mb-2">
                                    {searchTerm || selectedDepartment
                                        ? 'Không tìm thấy ngành học nào'
                                        : 'Chưa có ngành học nào'}
                                </p>
                                <p className="text-white/40">
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
                <div className="flex items-center justify-between bg-[#7E57C2]/30 rounded-xl px-4 py-2">
                    <div className="text-white/80">
                        Hiển thị {majors.length} ngành học
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-2"
                        >
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-[2rem] px-2 py-1 rounded-md ${
                                    currentPage === page
                                        ? 'bg-[#7E57C2] text-white'
                                        : 'text-white/80 hover:text-white'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-2"
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
