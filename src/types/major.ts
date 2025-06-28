export type Campus = 'HANOI' | 'HCMC' | 'DANANG' | 'CANTHO' | 'QNHON';

export type MajorFormProps = {
    initialData?: MajorFormData;
    onSubmit: (data: MajorFormData) => void;
}

export type CareerProspect = {
    title: string;
    description: string;
}

export type Scholarship = {
    name: string;
    description: string;
    value: string;
}

export type Tuition = {
    firstSem: number;
    midSem: number;
    lastSem: number;
}

export type CampusTuition = {
    HANOI?: Tuition;
    HCMC?: Tuition;
    DANANG?: Tuition;
    CANTHO?: Tuition;
    QNHON?: Tuition;
}

export type InternationalPartner = {
    country: string;
    universities: string[];
}

export type ProgramSection = {
    duration: string;
    objectives: string[];
    courses?: string[];
}

export type ProgramStructure = {
    preparation?: ProgramSection;
    basic?: ProgramSection;
    ojt?: {
        duration: string;
        objectives: string[];
    };
    specialization?: ProgramSection;
    graduation?: {
        duration: string;
        objectives: string[];
        options: string[];
    };
}

export type MajorFormData = {
    _id: string;
    name: string;
    department: string;
    description: string;
    shortDescription: string;
    code: string;
    totalCredits: number;
    tuition: Tuition;
    tuitionByCampus?: CampusTuition;
    requiredSkills: string[];
    advantages: string[];
    availableAt: Campus[];
    admissionCriteria: string;
    programStructure: ProgramStructure;
    careerProspects: CareerProspect[];
    subjectCombinations: string[];
    isNewProgram: boolean;
    scholarships: Scholarship[];
    majorImage?: File | null;
    imageUrl?: string;
    internationalPartners?: InternationalPartner[];
}