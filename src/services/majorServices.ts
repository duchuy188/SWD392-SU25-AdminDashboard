import { MajorFormData } from "../types/major";
import axiosInstance from "./axiosInstance";

export const adminMajorServices = {
    getAllMajors: async (params: {
        page?: number;
        limit?: number;
        search?: string;
        department?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        startDate?: string;
        endDate?: string;
    }) => {
        try {
            const response = await axiosInstance.get('/majors/admin', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
      
    getMajorById: async (id: string) => {
        try {
            const response = await axiosInstance.get(`/majors/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createMajor: async (majorData: FormData) => {
        try {
            const response = await axiosInstance.post('/majors', majorData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateMajor: async (id: string, majorData: FormData) => {
        try {
            const response = await axiosInstance.put(`/majors/${id}`, majorData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteMajor: async (id: string) => {
        try {
            const response = await axiosInstance.delete(`/majors/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createMajorFormData: (majorData: MajorFormData) => {
        const formData = new FormData();
        
        // Basic information
        formData.append('name', majorData.name);
        formData.append('department', majorData.department);
        formData.append('description', majorData.description);
        formData.append('shortDescription', majorData.shortDescription);
        formData.append('code', majorData.code);
        formData.append('totalCredits', majorData.totalCredits.toString());
        formData.append('admissionCriteria', majorData.admissionCriteria);
        formData.append('isNewProgram', majorData.isNewProgram.toString());
        
        // Image handling
        if (majorData.majorImage && majorData.majorImage instanceof File) {
            formData.append('majorImage', majorData.majorImage);
        }
        
        // Arrays
        if (majorData.requiredSkills?.length) {
            formData.append('requiredSkills', JSON.stringify(majorData.requiredSkills));
        }
        
        if (majorData.advantages?.length) {
            formData.append('advantages', JSON.stringify(majorData.advantages));
        }
        
        if (majorData.availableAt?.length) {
            // Chỉ gửi campus đầu tiên (dạng chuỗi) thay vì mảng
            const firstCampus = typeof majorData.availableAt === 'string' ? majorData.availableAt : majorData.availableAt[0];
            if (typeof firstCampus === 'string' && ['HANOI', 'HCMC', 'DANANG', 'CANTHO', 'QNHON'].includes(firstCampus)) {
                formData.append('availableAt', firstCampus);
            }
        }
        
        if (majorData.subjectCombinations?.length) {
            formData.append('subjectCombinations', JSON.stringify(majorData.subjectCombinations));
        }
        
        // Objects
        if (majorData.tuition) {
            formData.append('tuition', JSON.stringify(majorData.tuition));
        }
        
        if (majorData.tuitionByCampus) {
            formData.append('tuitionByCampus', JSON.stringify(majorData.tuitionByCampus));
        }
        
        if (majorData.programStructure) {
            formData.append('programStructure', JSON.stringify(majorData.programStructure));
        }
        
        // Complex arrays
        if (majorData.careerProspects?.length) {
            formData.append('careerProspects', JSON.stringify(majorData.careerProspects));
        }
        
        if (majorData.scholarships?.length) {
            formData.append('scholarships', JSON.stringify(majorData.scholarships));
        }

        if (majorData.internationalPartners?.length) {
            formData.append('internationalPartners', JSON.stringify(majorData.internationalPartners));
        }
        
        return formData;
    }
};