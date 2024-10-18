import ImportStudentForm from "@/Sections/Admin/Classrooms/ImportStudentForm";
import SectionForm from "@/Sections/Admin/Classrooms/SectionForm";
import StudentList from "@/Sections/Admin/Classrooms/StudentList";
import { AcademicYear, Grade, Section, Teacher, User } from "@/types";
import { router } from "@inertiajs/react";
import { Eye, PencilIcon, Trash2Icon, Upload } from "lucide-react";
import { ReactNode } from "react";
import Swal from "sweetalert2";

type Props = {
    grade: Grade;
    section: Section;
    openModal: (content: ReactNode) => void;
    closeModal: () => void;
    currentYear: AcademicYear;
    assignedTeachers: Teacher[];
    unassignedTeachers: User[];
};

export default function SectionCard({
    grade,
    section,
    openModal,
    closeModal,
    currentYear,
    assignedTeachers,
    unassignedTeachers,
}: Props) {
    const handleEditSection = (section: Section) => {
        openModal(
            <SectionForm
                grade={grade}
                academicYear={currentYear}
                onCloseModal={closeModal}
                unassignedTeachers={unassignedTeachers}
                sectionName={section.name}
                currentTeacher={
                    assignedTeachers.find(
                        (teacher) => teacher.user_id === section.userId
                    )?.user
                }
                sectionId={section.id}
            />
        );
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
                    only: ["assignedTeachers", "unassignedTeachers"],
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

    const handleImportStudents = (teacherId: number) => {
        openModal(
            <ImportStudentForm
                teacherId={teacherId}
                onCloseModal={closeModal}
            />
        );
    };

    const handleShowStudents = async (teacherId: number) => {
        // Hacer la solicitud para obtener estudiantes
        Swal.fire({
            icon: "info",
            title: "Obteniendo estudiantes...",
            text: "Estudiantes se están obteniendo",
        });
        fetch(`/admin/aulas/mostrar-estudiantes-por-docente/${teacherId}`)
            .then((response) => {
                // Verifica si la respuesta es correcta (status 200)
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Parsea la respuesta JSON
            })
            .then((data) => {
                Swal.fire({
                    icon: "success",
                    title: "¡Estudiantes obtenidos!",
                    text: "Estudiantes obtenidos exitosamente",
                });
                openModal(<StudentList students={data} />);
            })
            .catch((error) => {
                console.error("Error fetching data:", error); // Manejo de errores
            });
    };

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
                {section.teacher}{" "}
                {section.studentCount > 0 && `(${section.studentCount})`}
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                {section.studentCount > 0 ? (
                    <button
                        className="flex items-center justify-center w-full p-2 text-white transition-colors bg-purple-500 rounded-md hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
                        onClick={() => handleShowStudents(section.id)}
                    >
                        <Eye size={16} className="mr-2" />
                        Ver Alumnos
                    </button>
                ) : (
                    <button
                        className="flex items-center justify-center w-full p-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        onClick={() => handleImportStudents(section.id)}
                    >
                        <Upload size={16} className="mr-2" />
                        Importar Alumnos
                    </button>
                )}
            </div>
        </div>
    );
}
