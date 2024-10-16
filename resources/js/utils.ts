import { Grade, Teacher } from "./types";

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

        // Buscar el grado correspondiente en el array
        const gradeObj = result.find((g) => g.name === grade.toString());

        if (gradeObj) {
            // Buscar si la sección ya existe en el grado
            let sectionObj = gradeObj.sections.find((s) => s.name === section);

            if (!sectionObj) {
                // Si la sección no existe, crearla y agregarla
                sectionObj = { name: section, teacher: teacherName };
                gradeObj.sections.push(sectionObj);
            } else {
                // Si ya existe la sección, actualizar el docente (si es necesario)
                sectionObj.teacher = teacherName;
            }
        }
    });

    return result;
}
