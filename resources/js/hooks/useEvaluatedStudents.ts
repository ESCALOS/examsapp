import { Student } from "@/types";

export function useEvaluatedStudents(
    examAnswers: { student_id: number }[],
    students: Student[]
) {
    // Obtener IDs de estudiantes evaluados
    const evaluatedStudentIds = new Set(
        examAnswers.map((answer) => answer.student_id)
    );

    // Separar estudiantes evaluados y no evaluados
    const evaluatedStudents = students.filter((student) =>
        evaluatedStudentIds.has(student.id)
    );
    const notEvaluatedStudents = students.filter(
        (student) => !evaluatedStudentIds.has(student.id)
    );

    return { evaluatedStudents, notEvaluatedStudents };
}
