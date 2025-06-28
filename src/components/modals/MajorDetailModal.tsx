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
                        {(major.majorImage || major.imageUrl) && (
                            <div className="mb-6">
                                <img
                                    src={major.imageUrl || (major.majorImage instanceof File ? URL.createObjectURL(major.majorImage) : '')}
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
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Cơ sở đào tạo</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {major.availableAt.map((campus) => (
                                        <span key={campus} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                            {campus}
                                        </span>
                                    ))}
                                </div>
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
                                        <p className="text-sm font-semibold text-gray-900">{major.tuition.firstSem.toLocaleString()} VNĐ</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-600">Học kỳ giữa</label>
                                        <p className="text-sm font-semibold text-gray-900">{major.tuition.midSem.toLocaleString()} VNĐ</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <label className="block text-xs font-medium text-gray-600">Học kỳ cuối</label>
                                        <p className="text-sm font-semibold text-gray-900">{major.tuition.lastSem.toLocaleString()} VNĐ</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tuition By Campus */}
                        {major.tuitionByCampus && Object.keys(major.tuitionByCampus).length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Học phí theo cơ sở</h4>
                                <div className="space-y-4">
                                    {Object.entries(major.tuitionByCampus).map(([campus, tuition]) => (
                                        tuition && (
                                            <div key={campus} className="bg-gray-50 p-4 rounded-lg">
                                                <h5 className="font-medium text-gray-900 mb-3">{campus}</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600">Học kỳ đầu</label>
                                                        <p className="text-sm font-semibold text-gray-900">{tuition.firstSem.toLocaleString()} VNĐ</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600">Học kỳ giữa</label>
                                                        <p className="text-sm font-semibold text-gray-900">{tuition.midSem.toLocaleString()} VNĐ</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-600">Học kỳ cuối</label>
                                                        <p className="text-sm font-semibold text-gray-900">{tuition.lastSem.toLocaleString()} VNĐ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    ))}
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
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* International Partners */}
                        {major.internationalPartners && major.internationalPartners.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Đối tác quốc tế</h4>
                                <div className="space-y-4">
                                    {major.internationalPartners.map((partner, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-medium text-gray-900 mb-2">{partner.country}</h5>
                                            <ul className="list-disc list-inside space-y-1">
                                                {partner.universities.map((university, uniIndex) => (
                                                    <li key={uniIndex} className="text-sm text-gray-700">{university}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Program Structure */}
                        {major.programStructure && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Cấu trúc chương trình học</h4>
                                <div className="space-y-6">
                                    {/* Preparation Phase */}
                                    {major.programStructure.preparation && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-medium text-gray-900 mb-3">Giai đoạn chuẩn bị</h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Thời gian</label>
                                                    <p className="text-sm text-gray-900">{major.programStructure.preparation.duration}</p>
                                                </div>
                                                {major.programStructure.preparation.objectives?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600">Mục tiêu</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.preparation.objectives.map((objective, index) => (
                                                                <li key={index} className="text-sm text-gray-900">{objective}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {major.programStructure.preparation.courses && major.programStructure.preparation.courses.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600">Các môn học</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.preparation.courses.map((course, index) => (
                                                                <li key={index} className="text-sm text-gray-900">{course}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Basic Phase */}
                                    {major.programStructure.basic && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-medium text-gray-900 mb-3">Giai đoạn cơ bản</h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Thời gian</label>
                                                    <p className="text-sm text-gray-900">{major.programStructure.basic.duration}</p>
                                                </div>
                                                {major.programStructure.basic.objectives?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600">Mục tiêu</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.basic.objectives.map((objective, index) => (
                                                                <li key={index} className="text-sm text-gray-900">{objective}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {major.programStructure.basic.courses && major.programStructure.basic.courses.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600">Các môn học</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.basic.courses.map((course, index) => (
                                                                <li key={index} className="text-sm text-gray-900">{course}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* OJT Phase */}
                                    {major.programStructure.ojt && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-medium text-gray-900 mb-3">Giai đoạn OJT</h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Thời gian</label>
                                                    <p className="text-sm text-gray-900">{major.programStructure.ojt.duration}</p>
                                                </div>
                                                {major.programStructure.ojt.objectives?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600">Mục tiêu</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.ojt.objectives.map((objective, index) => (
                                                                <li key={index} className="text-sm text-gray-900">{objective}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Specialization Phase */}
                                    {major.programStructure.specialization && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-medium text-gray-900 mb-3">Giai đoạn chuyên ngành</h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Thời gian</label>
                                                    <p className="text-sm text-gray-900">{major.programStructure.specialization.duration}</p>
                                                </div>
                                                {major.programStructure.specialization.objectives?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600">Mục tiêu</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.specialization.objectives.map((objective, index) => (
                                                                <li key={index} className="text-sm text-gray-900">{objective}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {major.programStructure.specialization.courses && major.programStructure.specialization.courses.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600">Các môn học</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.specialization.courses.map((course, index) => (
                                                                <li key={index} className="text-sm text-gray-900">{course}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Graduation Phase */}
                                    {major.programStructure.graduation && (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-medium text-gray-900 mb-3">Giai đoạn tốt nghiệp</h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-600">Thời gian</label>
                                                    <p className="text-sm text-gray-900">{major.programStructure.graduation.duration}</p>
                                                </div>
                                                {major.programStructure.graduation.objectives?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600">Mục tiêu</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.graduation.objectives.map((objective, index) => (
                                                                <li key={index} className="text-sm text-gray-900">{objective}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {major.programStructure.graduation.options?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-600">Các lựa chọn</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.graduation.options.map((option, index) => (
                                                                <li key={index} className="text-sm text-gray-900">{option}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
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
