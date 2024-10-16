import { Grade, Section, Teacher, User } from "./types";

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
        result.push({ name: grade.toString(), sections: [] });
    }

    // Recorrer la lista de docentes
    teachers.forEach((teacher) => {
        const grade = Number(teacher.grade); // Convertir el grado a número
        const section = teacher.section;
        const teacherName = teacher.user.name; // Obtener el nombre del docente
        const teacherId = teacher.user.id; // Obtener el ID del docente

        // Buscar el grado correspondiente en el array
        const gradeObj = result.find((g) => g.name === grade.toString());
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
