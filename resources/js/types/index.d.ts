import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: "admin" | "teacher";
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    flash: {
        message?: string;
    };
    academicYears: AcademicYear[];
    activeTeachers: User[];
};

export interface AcademicYear {
    id: number;
    year: number;
}

export interface Teacher {
    id: number;
    user_id: number;
    academic_year_id: number;
    grade: string;
    section: string;
    user: User;
    academicYear: AcademicYear;
}

export interface Student {
    id: number;
    student_info_id: number;
    academic_year_id: number;
    grade: string;
    section: string;
    status: string;
}
export interface Grade {
    name: string;
    sections: Section[];
}

export interface Section {
    id: number;
    name: string;
    teacher: string;
    userId: number;
}

export interface StudentInfo {
    id: number;
    dni: string;
    name: string;
}
export interface Student {
    id: number;
    studentInfoId: number;
    academicYearId: number;
    grade: string;
    section: string;
    status: string;
    studentInfo: StudentInfo;
}
