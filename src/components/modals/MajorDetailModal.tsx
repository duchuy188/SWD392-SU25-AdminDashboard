import React from 'react';
import { MajorFormData } from '../../types/major';

interface MajorDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    major: MajorFormData;
    onEdit: () => void;
    onDelete: () => void;
}

const MajorDetailModal: React.FC<MajorDetailModalProps> = ({
    isOpen,
    onClose,
    major,
    onEdit,
    onDelete
}) => {
    if (!isOpen) return null;

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

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{major.name}</h3>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Mã ngành: {major.code}</span>
                                {getStatusBadge(major.status)}
                                {major.isNewProgram && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                        Chương trình mới
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={onEdit}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                onClick={onDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                            >
                                Xóa
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm font-medium"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {/* Image */}
                        {major.imageUrl && (
                            <div className="mb-6">
                                <img
                                    src={major.imageUrl}
                                    alt={major.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cơ bản</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Khoa/Viện</label>
                                    <p className="text-sm text-gray-900">{major.department}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tổng số tín chỉ</label>
                                    <p className="text-sm text-gray-900">{major.totalCredits}</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                                <p className="text-sm text-gray-900 mt-1">{major.shortDescription}</p>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Mô tả chi tiết</label>
                                <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{major.description}</p>
                            </div>
                        </div>

                        {/* Admission Criteria */}
                        {major.admissionCriteria && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Tiêu chí tuyển sinh</h4>
                                <p className="text-sm text-gray-900 whitespace-pre-wrap">{major.admissionCriteria}</p>
                            </div>
                        )}

                        {/* Required Skills */}
                        {major.requiredSkills && major.requiredSkills.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Kỹ năng cần thiết</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {major.requiredSkills.map((skill, index) => (
                                        <li key={index} className="text-sm text-gray-900">{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Advantages */}
                        {major.advantages && major.advantages.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Ưu điểm của ngành</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {major.advantages.map((advantage, index) => (
                                        <li key={index} className="text-sm text-gray-900">{advantage}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tuition */}
                        {major.tuition && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Học phí</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-600">Học kỳ đầu</label>
                                        <p className="text-sm font-semibold text-gray-900">{major.tuition.firstSem}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-600">Học kỳ giữa</label>
                                        <p className="text-sm font-semibold text-gray-900">{major.tuition.midSem}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-600">Học kỳ cuối</label>
                                        <p className="text-sm font-semibold text-gray-900">{major.tuition.lastSem}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Career Prospects */}
                        {major.careerProspects && major.careerProspects.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Triển vọng nghề nghiệp</h4>
                                <div className="space-y-4">
                                    {major.careerProspects.map((career, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-medium text-gray-900 mb-2">{career.title}</h5>
                                            <p className="text-sm text-gray-700">{career.description}</p>
                                            {career.opportunities && career.opportunities.length > 0 && (
                                                <div className="mt-2">
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Cơ hội việc làm
                                                    </label>
                                                    <ul className="list-disc list-inside text-sm text-gray-700">
                                                        {career.opportunities.map((opp, oppIndex) => (
                                                            <li key={oppIndex}>{opp}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Scholarships */}
                        {major.scholarships && major.scholarships.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Học bổng</h4>
                                <div className="space-y-4">
                                    {major.scholarships.map((scholarship, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-medium text-gray-900">{scholarship.name}</h5>
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                                    {scholarship.value}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700">{scholarship.description}</p>
                                            {scholarship.duration && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <strong>Thời hạn:</strong> {scholarship.duration}
                                                </p>
                                            )}
                                            {scholarship.deadline && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <strong>Hạn nộp:</strong> {scholarship.deadline}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Faculty Contact */}
                        {major.facultyContact && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin liên hệ</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600">Tên</label>
                                            <p className="text-sm text-gray-900">{major.facultyContact.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600">Email</label>
                                            <p className="text-sm text-gray-900">{major.facultyContact.email}</p>
                                        </div>
                                        {major.facultyContact.phone && (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600">Số điện thoại</label>
                                                <p className="text-sm text-gray-900">{major.facultyContact.phone}</p>
                                            </div>
                                        )}
                                        {major.facultyContact.office && (
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600">Văn phòng</label>
                                                <p className="text-sm text-gray-900">{major.facultyContact.office}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Statistics */}
                        {major.statistics && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Thống kê</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {major.statistics.enrollmentCount && (
                                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {major.statistics.enrollmentCount}
                                            </div>
                                            <div className="text-xs text-blue-800">Sinh viên đang học</div>
                                        </div>
                                    )}
                                    {major.statistics.graduationRate && (
                                        <div className="bg-green-50 p-3 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-green-600">
                                                {major.statistics.graduationRate}%
                                            </div>
                                            <div className="text-xs text-green-800">Tỷ lệ tốt nghiệp</div>
                                        </div>
                                    )}
                                    {major.statistics.employmentRate && (
                                        <div className="bg-purple-50 p-3 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                                {major.statistics.employmentRate}%
                                            </div>
                                            <div className="text-xs text-purple-800">Tỷ lệ có việc làm</div>
                                        </div>
                                    )}
                                    {major.statistics.averageSalary && (
                                        <div className="bg-orange-50 p-3 rounded-lg text-center">
                                            <div className="text-2xl font-bold text-orange-600">
                                                {major.statistics.averageSalary.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-orange-800">Lương trung bình (VNĐ)</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        {(major.createdAt || major.updatedAt) && (
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-xs text-gray-500">
                                    {major.createdAt && (
                                        <span>Tạo lúc: {new Date(major.createdAt).toLocaleString('vi-VN')}</span>
                                    )}
                                    {major.updatedAt && (
                                        <span>Cập nhật lúc: {new Date(major.updatedAt).toLocaleString('vi-VN')}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MajorDetailModal;
