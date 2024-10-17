import { Grade, Section, Student } from "@/types";
import { Eye, PencilIcon, Trash2Icon, Upload } from "lucide-react";

type Props = {
    grade: Grade;
    section: Section;
    students: Student[];
    handleEditSection: (section: Section) => void;
    handleDeleteSection: (id: number) => void;
    handleImportStudents: (section: string) => void;
    handleShowStudents: (grade: Grade, section: Section) => void;
};

export default function SectionCard({
    grade,
    section,
    students,
    handleEditSection,
    handleDeleteSection,
    handleImportStudents,
    handleShowStudents,
}: Props) {
    const studentsCount = students.filter(
        (student) =>
            student.section == section.name && student.grade == grade.name
    ).length;
    return (
        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2">
                    <button onClick={() => handleEditSection(section)}>
                        <PencilIcon
                            size={20}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        />
                    </button>

                    <button
                        title="Eliminar sección"
                        onClick={() => handleDeleteSection(section.id)}
                    >
                        <Trash2Icon
                            size={20}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        />
                    </button>
                </div>
            </div>
            <h4 className="mb-2 font-semibold">Sección {section.name}</h4>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                {section.teacher} {studentsCount > 0 && `(${studentsCount})`}
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                {students.some(
                    (students) =>
                        students.grade == grade.name &&
                        students.section == section.name
                ) ? (
                    <button
                        className="flex items-center justify-center w-full p-2 text-white transition-colors bg-purple-500 rounded-md hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
                        onClick={() => handleShowStudents(grade, section)}
                    >
                        <Eye size={16} className="mr-2" />
                        Ver Alumnos
                    </button>
                ) : (
                    <button
                        className="flex items-center justify-center w-full p-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        onClick={() => handleImportStudents(section.name)}
                    >
                        <Upload size={16} className="mr-2" />
                        Importar Alumnos
                    </button>
                )}
            </div>
        </div>
    );
}
