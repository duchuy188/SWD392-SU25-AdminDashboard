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
                <div className="fixed inset-0 transition-opacity bg-blue-900/80 backdrop-blur-sm" onClick={onClose}></div>

                <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-blue-200">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 rounded-xl">
                            <h3 className="text-2xl font-bold text-white mb-2">{major.name}</h3>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-white/90">Mã ngành: {major.code}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onEdit}
                                title="Chỉnh sửa thông tin ngành"
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                Chỉnh sửa
                            </button>
                            <button
                                onClick={onDelete}
                                title="Xóa ngành học này"
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-400 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                Xóa
                            </button>
                            <button
                                onClick={onClose}
                                title="Đóng cửa sổ chi tiết"
                                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-400 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl">
                        {/* Image */}
                        {(major.majorImage || major.imageUrl) && (
                            <div className="mb-6">
                                <img
                                    src={major.imageUrl || (major.majorImage instanceof File ? URL.createObjectURL(major.majorImage) : '')}
                                    alt={major.name}
                                    className="w-full h-48 object-cover rounded-xl shadow-lg border border-blue-200"
                                />
                            </div>
                        )}

                        {/* Basic Information */}
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">i</span>
                                </span>
                                Thông tin cơ bản
                            </h4>
                            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700">Khoa/Viện</label>
                                        <p className="text-sm text-gray-800">{major.department}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-700">Tổng số tín chỉ</label>
                                        <p className="text-sm text-gray-800">{major.totalCredits}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-blue-700">Mô tả ngắn</label>
                                    <p className="text-sm text-gray-800 mt-1">{major.shortDescription}</p>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-blue-700">Mô tả chi tiết</label>
                                    <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{major.description}</p>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-blue-700">Cơ sở đào tạo</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {major.availableAt.map((campus) => (
                                            <span key={campus} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs border border-blue-200">
                                                {campus}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admission Criteria */}
                        {major.admissionCriteria && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">T</span>
                                    </span>
                                    Tiêu chí tuyển sinh
                                </h4>
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-sm">
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{major.admissionCriteria}</p>
                                </div>
                            </div>
                        )}

                        {/* Required Skills */}
                        {major.requiredSkills && major.requiredSkills.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">S</span>
                                    </span>
                                    Kỹ năng cần thiết
                                </h4>
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-sm">
                                    <ul className="list-disc list-inside space-y-1">
                                        {major.requiredSkills.map((skill, index) => (
                                            <li key={index} className="text-sm text-gray-800">{skill}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Advantages */}
                        {major.advantages && major.advantages.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">A</span>
                                    </span>
                                    Ưu điểm của ngành
                                </h4>
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-sm">
                                    <ul className="list-disc list-inside space-y-1">
                                        {major.advantages.map((advantage, index) => (
                                            <li key={index} className="text-sm text-gray-800">{advantage}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Tuition */}
                        {major.tuition && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">$</span>
                                    </span>
                                    Học phí
                                </h4>
                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-blue-200 shadow-sm">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <label className="block text-xs font-medium text-blue-700">Học kỳ đầu</label>
                                            <p className="text-sm font-semibold text-gray-800">{major.tuition.firstSem.toLocaleString()} VNĐ</p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <label className="block text-xs font-medium text-blue-700">Học kỳ giữa</label>
                                            <p className="text-sm font-semibold text-gray-800">{major.tuition.midSem.toLocaleString()} VNĐ</p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <label className="block text-xs font-medium text-blue-700">Học kỳ cuối</label>
                                            <p className="text-sm font-semibold text-gray-800">{major.tuition.lastSem.toLocaleString()} VNĐ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tuition By Campus */}
                        {major.tuitionByCampus && Object.keys(major.tuitionByCampus).length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">C</span>
                                    </span>
                                    Học phí theo cơ sở
                                </h4>
                                <div className="space-y-4">
                                    {Object.entries(major.tuitionByCampus).map(([campus, tuition]) => (
                                        tuition && (
                                            <div key={campus} className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                                                <h5 className="font-medium text-blue-800 mb-3">{campus}</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                        <label className="block text-xs font-medium text-blue-700">Học kỳ đầu</label>
                                                        <p className="text-sm font-semibold text-gray-800">{tuition.firstSem.toLocaleString()} VNĐ</p>
                                                    </div>
                                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                        <label className="block text-xs font-medium text-blue-700">Học kỳ giữa</label>
                                                        <p className="text-sm font-semibold text-gray-800">{tuition.midSem.toLocaleString()} VNĐ</p>
                                                    </div>
                                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                        <label className="block text-xs font-medium text-blue-700">Học kỳ cuối</label>
                                                        <p className="text-sm font-semibold text-gray-800">{tuition.lastSem.toLocaleString()} VNĐ</p>
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
                                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">W</span>
                                    </span>
                                    Triển vọng nghề nghiệp
                                </h4>
                                <div className="space-y-4">
                                    {major.careerProspects.map((career, index) => (
                                        <div key={index} className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                                            <h5 className="font-medium text-blue-800 mb-2">{career.title}</h5>
                                            <p className="text-sm text-gray-700">{career.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Scholarships */}
                        {major.scholarships && major.scholarships.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">★</span>
                                    </span>
                                    Học bổng
                                </h4>
                                <div className="space-y-4">
                                    {major.scholarships.map((scholarship, index) => (
                                        <div key={index} className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-medium text-blue-800">{scholarship.name}</h5>
                                                <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200">
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
                                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">🌍</span>
                                    </span>
                                    Đối tác quốc tế
                                </h4>
                                <div className="space-y-4">
                                    {major.internationalPartners.map((partner, index) => (
                                        <div key={index} className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                                            <h5 className="font-medium text-blue-800 mb-2">{partner.country}</h5>
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
                                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">P</span>
                                    </span>
                                    Cấu trúc chương trình học
                                </h4>
                                <div className="space-y-6">
                                    {/* Preparation Phase */}
                                    {major.programStructure.preparation && (
                                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                                            <h5 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                                                <span className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"></span>
                                                Giai đoạn chuẩn bị
                                            </h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-700">Thời gian</label>
                                                    <p className="text-sm text-gray-800">{major.programStructure.preparation.duration}</p>
                                                </div>
                                                {major.programStructure.preparation.objectives?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-700">Mục tiêu</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.preparation.objectives.map((objective, index) => (
                                                                <li key={index} className="text-sm text-gray-800">{objective}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {major.programStructure.preparation.courses && major.programStructure.preparation.courses.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-700">Các môn học</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.preparation.courses.map((course, index) => (
                                                                <li key={index} className="text-sm text-gray-800">{course}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Basic Phase */}
                                    {major.programStructure.basic && (
                                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                                            <h5 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                                                <span className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full"></span>
                                                Giai đoạn cơ bản
                                            </h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-700">Thời gian</label>
                                                    <p className="text-sm text-gray-800">{major.programStructure.basic.duration}</p>
                                                </div>
                                                {major.programStructure.basic.objectives?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-700">Mục tiêu</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.basic.objectives.map((objective, index) => (
                                                                <li key={index} className="text-sm text-gray-800">{objective}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {major.programStructure.basic.courses && major.programStructure.basic.courses.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-700">Các môn học</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.basic.courses.map((course, index) => (
                                                                <li key={index} className="text-sm text-gray-800">{course}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* OJT Phase */}
                                    {major.programStructure.ojt && (
                                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                                            <h5 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                                                <span className="w-4 h-4 bg-gradient-to-r from-orange-400 to-red-300 rounded-full"></span>
                                                Giai đoạn OJT
                                            </h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-700">Thời gian</label>
                                                    <p className="text-sm text-gray-800">{major.programStructure.ojt.duration}</p>
                                                </div>
                                                {major.programStructure.ojt.objectives?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-700">Mục tiêu</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.ojt.objectives.map((objective, index) => (
                                                                <li key={index} className="text-sm text-gray-800">{objective}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Specialization Phase */}
                                    {major.programStructure.specialization && (
                                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                                            <h5 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                                                <span className="w-4 h-4 bg-gradient-to-r from-purple-400 to-violet-300 rounded-full"></span>
                                                Giai đoạn chuyên ngành
                                            </h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-700">Thời gian</label>
                                                    <p className="text-sm text-gray-800">{major.programStructure.specialization.duration}</p>
                                                </div>
                                                {major.programStructure.specialization.objectives?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-700">Mục tiêu</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.specialization.objectives.map((objective, index) => (
                                                                <li key={index} className="text-sm text-gray-800">{objective}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {major.programStructure.specialization.courses && major.programStructure.specialization.courses.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-700">Các môn học</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.specialization.courses.map((course, index) => (
                                                                <li key={index} className="text-sm text-gray-800">{course}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Graduation Phase */}
                                    {major.programStructure.graduation && (
                                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-blue-200 shadow-sm">
                                            <h5 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                                                <span className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full"></span>
                                                Giai đoạn tốt nghiệp
                                            </h5>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-blue-700">Thời gian</label>
                                                    <p className="text-sm text-gray-800">{major.programStructure.graduation.duration}</p>
                                                </div>
                                                {major.programStructure.graduation.objectives?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-700">Mục tiêu</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.graduation.objectives.map((objective, index) => (
                                                                <li key={index} className="text-sm text-gray-800">{objective}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                {major.programStructure.graduation.options?.length > 0 && (
                                                    <div>
                                                        <label className="block text-sm font-medium text-blue-700">Các lựa chọn</label>
                                                        <ul className="list-disc list-inside space-y-1">
                                                            {major.programStructure.graduation.options.map((option, index) => (
                                                                <li key={index} className="text-sm text-gray-800">{option}</li>
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
