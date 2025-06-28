
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
        status?: 'active' | 'inactive' | 'draft';
        startDate?: string;
        endDate?: string;
    }) => {
        return await axiosInstance.get('/majors/admin', { params });
    },
      
    getMajorById: async (id: string) => {
        return await axiosInstance.get(`/majors/${id}`, {
            params: {
                includeStatistics: true,
                includeAccreditation: true,
                includeFacultyContact: true
            }
        });
    },

    createMajor: async (majorData: FormData) => {
        return await axiosInstance.post('/majors', majorData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    updateMajor: async (id: string, majorData: FormData) => {
        return await axiosInstance.put(`/majors/${id}`, majorData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    deleteMajor: async (id: string) => {
        return await axiosInstance.delete(`/majors/${id}`);
    },

    createMajorFormData: (majorData: MajorFormData) => {
        const formData = new FormData();
        
        // Basic information
        if (majorData.name) formData.append('name', majorData.name);
        if (majorData.department) formData.append('department', majorData.department);
        if (majorData.description) formData.append('description', majorData.description);
        if (majorData.shortDescription) formData.append('shortDescription', majorData.shortDescription);
        if (majorData.code) formData.append('code', majorData.code);
        if (majorData.totalCredits) formData.append('totalCredits', majorData.totalCredits.toString());
        if (majorData.admissionCriteria) formData.append('admissionCriteria', majorData.admissionCriteria);
        if (majorData.isNewProgram !== undefined) formData.append('isNewProgram', majorData.isNewProgram.toString());
        if (majorData.status) formData.append('status', majorData.status);
        if (majorData.startDate) formData.append('startDate', majorData.startDate);
        if (majorData.endDate) formData.append('endDate', majorData.endDate);
        
        // Image handling
        if (majorData.majorImage && majorData.majorImage instanceof File) {
            formData.append('majorImage', majorData.majorImage);
        }
        
        // Arrays and objects
        if (majorData.requiredSkills?.length) {
            formData.append('requiredSkills', JSON.stringify(majorData.requiredSkills));
        }
        
        if (majorData.advantages?.length) {
            formData.append('advantages', JSON.stringify(majorData.advantages));
        }
        
        if (majorData.availableAt?.length) {
            formData.append('availableAt', JSON.stringify(majorData.availableAt));
        }
        
        if (majorData.subjectCombinations?.length) {
            formData.append('subjectCombinations', JSON.stringify(majorData.subjectCombinations));
        }
        
        if (majorData.careerProspects?.length) {
            formData.append('careerProspects', JSON.stringify(majorData.careerProspects));
        }
        
        if (majorData.scholarships?.length) {
            formData.append('scholarships', JSON.stringify(majorData.scholarships));
        }
        
        // Tuition information
        if (majorData.tuition) {
            formData.append('tuition', JSON.stringify(majorData.tuition));
        }
        
        if (majorData.tuitionByCampus) {
            formData.append('tuitionByCampus', JSON.stringify(majorData.tuitionByCampus));
        }
        
        // Faculty contact
        if (majorData.facultyContact) {
            formData.append('facultyContact', JSON.stringify(majorData.facultyContact));
        }

        // Accreditation
        if (majorData.accreditation?.length) {
            formData.append('accreditation', JSON.stringify(majorData.accreditation));
        }

        // Statistics
        if (majorData.statistics) {
            formData.append('statistics', JSON.stringify(majorData.statistics));
        }
        
        // Program Structure
        if (majorData.programStructure) {
            // Ensure graduation section has default values
            if (majorData.programStructure.graduation) {
                if (!majorData.programStructure.graduation.duration) {
                    majorData.programStructure.graduation.duration = "Học kỳ cuối";
                }
                if (!majorData.programStructure.graduation.objectives) {
                    majorData.programStructure.graduation.objectives = [];
                }
                if (!majorData.programStructure.graduation.options) {
                    majorData.programStructure.graduation.options = [];
                }
            }
            
            formData.append('programStructure', JSON.stringify(majorData.programStructure));
        }
        
        return formData;
    }
};