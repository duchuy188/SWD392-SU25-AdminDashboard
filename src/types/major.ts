export type MajorFormProps = {
    initialData?: MajorFormData;
    onSubmit: (data: MajorFormData) => void;
}

export type CareerProspect = {
    title: string;
    description: string;
    opportunities?: string[];
    industries?: string[];
}

export type Scholarship = {
    name: string;
    description: string;
    value: string;
    criteria?: string[];
    duration?: string;
    deadline?: string;
}

export type Tuition = {
    firstSem: string | number;
    midSem: string | number;
    lastSem: string | number;
    currency?: string;
    notes?: string;
}

export type CampusTuition = {
    [key: string]: Tuition;
}

export type ProgramSectionBase = {
    duration: string;
    objectives: string[];
    credits?: number;
    description?: string;
}

export type Course = {
    code: string;
    name: string;
    credits: number;
    description?: string;
    prerequisites?: string[];
}

export type ProgramSectionWithCourses = ProgramSectionBase & {
    courses: Course[];
    totalCredits?: number;
}

export type GraduationSection = ProgramSectionBase & {
    options: string[];
    requirements?: string[];
    thesisDetails?: string;
}

export type ProgramStructure = {
    preparation: ProgramSectionWithCourses;
    basic: ProgramSectionWithCourses;
    ojt: ProgramSectionBase & {
        partnerCompanies?: string[];
        duration?: string;
        evaluationCriteria?: string[];
    };
    specialization: ProgramSectionWithCourses;
    graduation: GraduationSection;
}

export type MajorFormData = {
    id?: string;
    name: string;
    code: string;
    department: string;
    description: string;
    shortDescription: string;
    totalCredits: string | number;
    admissionCriteria: string;
    isNewProgram: boolean;
    requiredSkills: string[];
    advantages: string[];
    availableAt: string[];
    subjectCombinations: string[];
    tuition: Tuition;
    tuitionByCampus?: CampusTuition;
    programStructure: ProgramStructure;
    careerProspects: CareerProspect[];
    scholarships: Scholarship[];
    imageUrl?: string;
    majorImage?: File | null;
    status?: 'active' | 'inactive' | 'draft';
    createdAt?: string;
    updatedAt?: string;
    startDate?: string;
    endDate?: string;
    facultyContact?: {
        name: string;
        email: string;
        phone?: string;
        office?: string;
    };
    accreditation?: {
        body: string;
        status: string;
        validUntil: string;
    }[];
    statistics?: {
        enrollmentCount?: number;
        graduationRate?: number;
        employmentRate?: number;
        averageSalary?: number;
    };
}