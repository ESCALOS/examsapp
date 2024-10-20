import { Config } from "ziggy-js";

export interface User {
    id: number;
    dni: string;
    name: string;
    email: string;
    email_verified_at?: string;
    role: "admin" | "teacher";
    is_active: boolean;
    teachers: Teacher[];
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
    exams: Exam[];
    students: Student[];
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
    student_count: number;
}

export interface Student {
    id: number;
    name: string;
    teacher: Teacher[];
    status: string;
}
export interface Grade {
    name: number;
    sections: Section[];
}

export interface Section {
    id: number;
    name: string;
    teacher: string;
    userId: number;
    studentCount: number;
}

export interface QuestionModel {
    question_number: number;
    correct_answer: string;
}

export interface Answer {
    id: number;
    student_id: number;
    exam_id: number;
    question_number: number;
    answer: string | null;
    student: Student;
}

export interface Exam {
    id: number;
    name: string;
    grade: string;
    students_evaluated: number;
}

export interface ExamsByGrade {
    name: string;
    exams: Exam[];
}

export type Question = {
    id: number;
    correctAnswer: string | null;
};
