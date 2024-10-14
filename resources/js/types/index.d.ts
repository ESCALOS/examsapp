import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: string;
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
}

export interface Student {
    id: number;
    student_info_id: number;
    academic_year_id: number;
    grade: string;
    section: string;
    status: string;
}
