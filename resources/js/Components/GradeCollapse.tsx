import React, { ReactNode } from "react";
import { Eye, PencilIcon, Trash2Icon, Upload } from "lucide-react";
import { AcademicYear, Grade, Section, Student, Teacher } from "@/types";
import Collapse from "./Collapse";
import Swal from "sweetalert2";
import SectionForm from "@/Sections/Admin/Classrooms/SectionForm";
import { router, useForm } from "@inertiajs/react";
import ImportStudentForm from "@/Sections/Admin/Classrooms/ImportStudentForm";

interface GradeCollapseProps {
    grade: Grade;
    students: Student[];
    currentYear: AcademicYear;
    teachers: Teacher[];
    setFormContent: React.Dispatch<React.SetStateAction<ReactNode>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const GradeCollapse: React.FC<GradeCollapseProps> = ({
    grade,
    students,
    currentYear,
    teachers,
    setShowModal,
    setFormContent,
}) => {
    const handleAddSection = () => {
        if (grade.sections.length === 5) {
            Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "No puedes añadir más de 5 secciones a un grado",
            });
            return;
        }
        setFormContent(
            <SectionForm
                grade={grade}
                academicYear={currentYear}
                onCloseModal={() => setShowModal(false)}
                assignedTeachers={teachers}
            />
        );
        setShowModal(true);
    };

    const handleEditSection = (section: Section) => {
        setFormContent(
            <SectionForm
                grade={grade}
                academicYear={currentYear}
                onCloseModal={() => setShowModal(false)}
                assignedTeachers={teachers}
                sectionName={section.name}
                userId={section.userId}
                sectionId={section.id}
                type="edit"
            />
        );
        setShowModal(true);
    };

    const handleDeleteSection = (id: number) => {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Esta acción no se puede deshacer",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar sección",
        }).then((result) => {
            if (result.isConfirmed) {
                router.visit(route("admin.classrooms.delete-section"), {
                    method: "delete",
                    data: { id: id },
                    onSuccess: () => {
                        // Si la solicitud fue exitosa
                        Swal.fire({
                            icon: "success",
                            title: "¡Eliminado!",
                            text: "La sección se ha eliminado correctamente",
                        });
                    },
                    onProgress: () => {
                        // Si la solicitud está en curso
                        Swal.fire({
                            icon: "info",
                            title: "Eliminando...",
                            text: "La sección se está eliminando",
                        });
                    },
                    onError: (page) => {
                        // Si hubo algún error, mostrarlo en SweetAlert
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text:
                                page.message ||
                                "Hubo un problema al eliminar la sección.",
                        });
                    },
                });
            }
        });
    };

    const handleImportStudents = (section: string) => {
        setFormContent(
            <ImportStudentForm
                academicYearId={currentYear.id}
                grade={grade.name}
                section={section}
                onCloseModal={() => setShowModal(false)}
            />
        );
        setShowModal(true);
    };

    return (
        <Collapse
            title={grade.name + "° grado"}
            onAddButtonClick={handleAddSection}
            showAddButton={grade.sections.length < 5}
        >
            <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {grade.sections
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((section, index) => (
                            <div
                                key={index}
                                className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800"
                            >
                                <div className="absolute top-2 right-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handleEditSection(section)
                                            }
                                        >
                                            <PencilIcon
                                                size={20}
                                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            />
                                        </button>

                                        <button
                                            title="Eliminar sección"
                                            onClick={() =>
                                                handleDeleteSection(section.id)
                                            }
                                        >
                                            <Trash2Icon
                                                size={20}
                                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                            />
                                        </button>
                                    </div>
                                </div>
                                <h4 className="mb-2 font-semibold">
                                    Sección {section.name}
                                </h4>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    Docente: {section.teacher}
                                </p>
                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                    {students.some(
                                        (students) =>
                                            students.grade == grade.name &&
                                            students.section == section.name
                                    ) ? (
                                        <button
                                            className="flex items-center justify-center w-full p-2 text-white transition-colors bg-purple-500 rounded-md hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
                                            onClick={() =>
                                                alert(
                                                    "Ver más detalles de la sección " +
                                                        section.name
                                                )
                                            }
                                        >
                                            <Eye size={16} className="mr-2" />
                                            Ver Alumnos
                                        </button>
                                    ) : (
                                        <button
                                            className="flex items-center justify-center w-full p-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                            onClick={() =>
                                                handleImportStudents(
                                                    section.name
                                                )
                                            }
                                        >
                                            <Upload
                                                size={16}
                                                className="mr-2"
                                            />
                                            Importar Alumnos
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </Collapse>
    );
};

export default GradeCollapse;
