import React, { useState, useEffect } from 'react';
import { MajorFormData, CareerProspect, Scholarship, Course } from '../../types/major';

interface CreateMajorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MajorFormData) => void;
    initialData?: MajorFormData;
    isEdit?: boolean;
}

const CreateMajorModal: React.FC<CreateMajorModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEdit = false
}) => {
    const [formData, setFormData] = useState<MajorFormData>({
        name: '',
        code: '',
        department: '',
        description: '',
        shortDescription: '',
        totalCredits: '',
        admissionCriteria: '',
        isNewProgram: false,
        requiredSkills: [],
        advantages: [],
        availableAt: [],
        subjectCombinations: [],
        tuition: {
            firstSem: '',
            midSem: '',
            lastSem: ''
        },
        programStructure: {
            preparation: {
                duration: '',
                objectives: [],
                courses: []
            },
            basic: {
                duration: '',
                objectives: [],
                courses: []
            },
            ojt: {
                duration: '',
                objectives: []
            },
            specialization: {
                duration: '',
                objectives: [],
                courses: []
            },
            graduation: {
                duration: '',
                objectives: [],
                options: []
            }
        },
        careerProspects: [],
        scholarships: [],
        status: 'draft'
    });

    const [activeTab, setActiveTab] = useState('basic');

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
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNestedInputChange = (section: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof MajorFormData] as any,
                [field]: value
            }
        }));
    };

    const handleArrayInputChange = (field: string, index: number, value: string) => {
        setFormData(prev => {
            const array = [...(prev[field as keyof MajorFormData] as string[])];
            array[index] = value;
            return { ...prev, [field]: array };
        });
    };

    const addArrayItem = (field: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field as keyof MajorFormData] as string[]), '']
        }));
    };

    const removeArrayItem = (field: string, index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field as keyof MajorFormData] as string[]).filter((_, i) => i !== index)
        }));
    };

    const handleCareerProspectChange = (index: number, field: keyof CareerProspect, value: any) => {
        setFormData(prev => {
            const careerProspects = [...prev.careerProspects];
            careerProspects[index] = { ...careerProspects[index], [field]: value };
            return { ...prev, careerProspects };
        });
    };

    const addCareerProspect = () => {
        setFormData(prev => ({
            ...prev,
            careerProspects: [...prev.careerProspects, { title: '', description: '' }]
        }));
    };

    const removeCareerProspect = (index: number) => {
        setFormData(prev => ({
            ...prev,
            careerProspects: prev.careerProspects.filter((_, i) => i !== index)
        }));
    };

    const handleScholarshipChange = (index: number, field: keyof Scholarship, value: any) => {
        setFormData(prev => {
            const scholarships = [...prev.scholarships];
            scholarships[index] = { ...scholarships[index], [field]: value };
            return { ...prev, scholarships };
        });
    };

    const addScholarship = () => {
        setFormData(prev => ({
            ...prev,
            scholarships: [...prev.scholarships, { name: '', description: '', value: '' }]
        }));
    };

    const removeScholarship = (index: number) => {
        setFormData(prev => ({
            ...prev,
            scholarships: prev.scholarships.filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, majorImage: file }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    const tabsConfig = [
        { id: 'basic', label: 'Thông tin cơ bản' },
        { id: 'details', label: 'Thông tin chi tiết' },
        { id: 'program', label: 'Chương trình đào tạo' },
        { id: 'career', label: 'Nghề nghiệp & Học bổng' }
    ];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

                <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            {isEdit ? 'Chỉnh sửa ngành học' : 'Thêm ngành học mới'}
                        </h3>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                            {tabsConfig.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên ngành học *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Nhập tên ngành học"
                                            aria-label="Tên ngành học"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mã ngành *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.code}
                                            onChange={(e) => handleInputChange('code', e.target.value)}
                                            placeholder="Nhập mã ngành"
                                            aria-label="Mã ngành"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Khoa/Viện *
                                        </label>
                                        <select
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.department}
                                            onChange={(e) => handleInputChange('department', e.target.value)}
                                            aria-label="Chọn khoa/viện"
                                        >
                                            <option value="">Chọn khoa/viện</option>
                                            {departments.map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tổng số tín chỉ *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.totalCredits}
                                            onChange={(e) => handleInputChange('totalCredits', e.target.value)}
                                            placeholder="Nhập số tín chỉ"
                                            aria-label="Tổng số tín chỉ"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mô tả ngắn *
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.shortDescription}
                                        onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                                        placeholder="Nhập mô tả ngắn về ngành học"
                                        aria-label="Mô tả ngắn"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mô tả chi tiết *
                                    </label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="Nhập mô tả chi tiết về ngành học..."
                                        title="Mô tả chi tiết về ngành học"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hình ảnh ngành học
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        placeholder="Chọn hình ảnh cho ngành học"
                                        title="Chọn hình ảnh cho ngành học"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng thái
                                        </label>
                                        <select
                                            title="Chọn trạng thái ngành học"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={formData.status}
                                            onChange={(e) => handleInputChange('status', e.target.value)}
                                        >
                                            <option value="draft">Bản nháp</option>
                                            <option value="active">Hoạt động</option>
                                            <option value="inactive">Không hoạt động</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isNewProgram"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            checked={formData.isNewProgram}
                                            onChange={(e) => handleInputChange('isNewProgram', e.target.checked)}
                                        />
                                        <label htmlFor="isNewProgram" className="ml-2 block text-sm text-gray-900">
                                            Chương trình mới
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tiêu chí tuyển sinh
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Nhập tiêu chí tuyển sinh..."
                                        title="Tiêu chí tuyển sinh"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.admissionCriteria}
                                        onChange={(e) => handleInputChange('admissionCriteria', e.target.value)}
                                    />
                                </div>

                                {/* Required Skills */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kỹ năng cần thiết
                                    </label>
                                    {formData.requiredSkills.map((skill, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={skill}
                                                onChange={(e) => handleArrayInputChange('requiredSkills', index, e.target.value)}
                                                placeholder="Nhập kỹ năng"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem('requiredSkills', index)}
                                                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('requiredSkills')}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        + Thêm kỹ năng
                                    </button>
                                </div>

                                {/* Advantages */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ưu điểm của ngành
                                    </label>
                                    {formData.advantages.map((advantage, index) => (
                                        <div key={index} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={advantage}
                                                onChange={(e) => handleArrayInputChange('advantages', index, e.target.value)}
                                                placeholder="Nhập ưu điểm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeArrayItem('advantages', index)}
                                                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('advantages')}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        + Thêm ưu điểm
                                    </button>
                                </div>

                                {/* Tuition */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Học phí
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Học kỳ đầu</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.tuition.firstSem}
                                                onChange={(e) => handleNestedInputChange('tuition', 'firstSem', e.target.value)}
                                                placeholder="VD: 15,000,000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Học kỳ giữa</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.tuition.midSem}
                                                onChange={(e) => handleNestedInputChange('tuition', 'midSem', e.target.value)}
                                                placeholder="VD: 15,000,000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Học kỳ cuối</label>
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={formData.tuition.lastSem}
                                                onChange={(e) => handleNestedInputChange('tuition', 'lastSem', e.target.value)}
                                                placeholder="VD: 15,000,000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Career & Scholarships Tab */}
                        {activeTab === 'career' && (
                            <div className="space-y-6">
                                {/* Career Prospects */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Triển vọng nghề nghiệp
                                    </label>
                                    {formData.careerProspects.map((career, index) => (
                                        <div key={index} className="border border-gray-300 rounded-md p-4 mb-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Tiêu đề</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={career.title}
                                                        onChange={(e) => handleCareerProspectChange(index, 'title', e.target.value)}
                                                        placeholder="VD: Lập trình viên"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
                                                    <textarea
                                                        rows={3}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={career.description}
                                                        onChange={(e) => handleCareerProspectChange(index, 'description', e.target.value)}
                                                        placeholder="Mô tả về nghề nghiệp này"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeCareerProspect(index)}
                                                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addCareerProspect}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        + Thêm triển vọng nghề nghiệp
                                    </button>
                                </div>

                                {/* Scholarships */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Học bổng
                                    </label>
                                    {formData.scholarships.map((scholarship, index) => (
                                        <div key={index} className="border border-gray-300 rounded-md p-4 mb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Tên học bổng</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={scholarship.name}
                                                        onChange={(e) => handleScholarshipChange(index, 'name', e.target.value)}
                                                        placeholder="VD: Học bổng xuất sắc"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1">Giá trị</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={scholarship.value}
                                                        onChange={(e) => handleScholarshipChange(index, 'value', e.target.value)}
                                                        placeholder="VD: 50% học phí"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
                                                <textarea
                                                    rows={2}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={scholarship.description}
                                                    onChange={(e) => handleScholarshipChange(index, 'description', e.target.value)}
                                                    placeholder="Mô tả về học bổng này"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeScholarship(index)}
                                                className="mt-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addScholarship}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        + Thêm học bổng
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {isEdit ? 'Cập nhật' : 'Tạo mới'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateMajorModal;
