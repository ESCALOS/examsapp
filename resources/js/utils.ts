import {
    Exam,
    ExamsByGrade,
    Grade,
    Question,
    QuestionModel,
    Section,
    Student,
    Teacher,
    User,
} from "./types";

export function availableSections(
    sections: Section[],
    currentSection?: string
): string[] {
    const allSections = ["A", "B", "C", "D", "E"];

    return allSections.filter(
        (section) =>
            // Si es la sección actual, la omitimos del filtrado
            section === currentSection ||
            // Sino, verificamos si no está en la lista de secciones ya asignadas
            !sections.some((t) => t.name === section)
    );
}

export function transformTeachers(teachers: Teacher[]): Grade[] {
    const result: Grade[] = [];

    // Inicializar el array de grados (1 al 6)
    for (let grade = 1; grade <= 6; grade++) {
        result.push({ name: grade, sections: [] });
    }

    // Recorrer la lista de docentes
    teachers.forEach((teacher) => {
        const grade = Number(teacher.grade); // Convertir el grado a número
        const section = teacher.section;
        const teacherName = teacher.user.name; // Obtener el nombre del docente
        const teacherId = teacher.user.id; // Obtener el ID del docente

        // Buscar el grado correspondiente en el array
        const gradeObj = result.find((g) => g.name === grade);
        if (gradeObj) {
            // Buscar si la sección ya existe en el grado
            let sectionObj = gradeObj.sections.find((s) => s.name === section);

            if (!sectionObj) {
                // Si la sección no existe, crearla y agregarla
                sectionObj = {
                    id: teacher.id,
                    name: section,
                    teacher: teacherName,
                    userId: teacherId,
                };
                gradeObj.sections.push(sectionObj);
            } else {
                // Si ya existe la sección, actualizar el docente (si es necesario)
                sectionObj.id = teacher.id;
                sectionObj.teacher = teacherName;
                sectionObj.userId = teacherId;
            }
        }
    });

    return result;
}

export function filterUnassignedTeachers(
    teachers: User[],
    teachersAssigned: Teacher[],
    currentTeacherId?: number
) {
    const assignedIds = teachersAssigned.map((assigned) => assigned.user_id);

    return teachers.filter(
        (teacher) =>
            // Si es el profesor actual, no lo eliminamos
            teacher.id === currentTeacherId ||
            // Sino, verificamos que no esté asignado
            !assignedIds.includes(teacher.id)
    );
}

export function groupExamsByGrade(exams: Exam[]): ExamsByGrade[] {
    const result: ExamsByGrade[] = [];

    // Inicializa el array con los grados del 1 al 6
    for (let grade = 1; grade <= 6; grade++) {
        result.push({ name: grade.toString(), exams: [] });
    }

    // Agrupar los exámenes por grado
    exams.forEach((exam) => {
        const gradeIndex = result.findIndex(
            (g) => g.name === exam.grade.toString()
        );
        if (gradeIndex !== -1) {
            result[gradeIndex].exams.push(exam);
        }
    });

    return result;
}

export function createQuestions(amount: number): Question[] {
    const questions: Question[] = [];

    for (let i = 1; i <= amount; i++) {
        questions.push({
            id: i,
            correctAnswer: null, // Puedes inicializar con null o algún valor por defecto
        });
    }

    return questions;
}

export function validateQuestions(
    validAnswers: string[],
    questions: Question[]
): { idError: number; areErrors: boolean } {
    let areErrors = false;
    let idError = 0;
    for (const question of questions) {
        const { id, correctAnswer } = question;

        // Verificar si la respuesta es null o no es una de las válidas
        areErrors =
            correctAnswer === null || !validAnswers.includes(correctAnswer);
        if (areErrors) {
            idError = id;
            break;
        }
    }
    return { idError, areErrors };
}

export function transformQuestions(models: QuestionModel[]): Question[] {
    return models.map((model) => ({
        id: model.question_number, // Usamos questionNumber como id
        correctAnswer: model.correct_answer || null, // Asignamos el valor de answer o null si está vacío
    }));
}

export const calculateAnswersSummary = (
    selectedAnswers: string[],
    questions: QuestionModel[]
) => {
    let correct = 0;
    let incorrect = 0;
    let notAnswered = 0;

    selectedAnswers.forEach((answer, index) => {
        if (answer === "") {
            notAnswered++;
        } else if (answer === questions[index].correct_answer) {
            correct++;
        } else {
            incorrect++;
        }
    });

    return { correct, incorrect, notAnswered };
};

export const generateRanking = (exam: Exam) => {
    const { questions, answers } = exam;

    // Calcular respuestas correctas, incorrectas y en blanco por estudiante
    const studentsMap = new Map<
        number,
        { student: Student; correct: number; incorrect: number; blank: number }
    >();

    answers.forEach((answer) => {
        const correctAnswer = questions.find(
            (q) => q.question_number === answer.question_number
        )?.correct_answer;
        const studentData = studentsMap.get(answer.student_id) || {
            student: answer.student,
            correct: 0,
            incorrect: 0,
            blank: 0,
        };

        if (answer.answer === null) {
            studentData.blank++;
        } else if (answer.answer === correctAnswer) {
            studentData.correct++;
        } else {
            studentData.incorrect++;
        }

        studentsMap.set(answer.student_id, studentData);
    });

    // Ordenar por respuestas correctas y generar el ranking
    const sortedStudents = Array.from(studentsMap.values()).sort(
        (a, b) => b.correct - a.correct
    );

    // Asignar puestos
    let rank = 1;
    let previousScore = sortedStudents[0]?.correct || 0;

    return sortedStudents.map((studentData, index) => {
        if (studentData.correct !== previousScore) {
            rank = index + 1;
            previousScore = studentData.correct;
        }

        return {
            ...studentData,
            rank,
        };
    });
};
