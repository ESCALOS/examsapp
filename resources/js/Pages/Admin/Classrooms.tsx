import GradeCollapse from "@/Components/GradeCollapse";
import Modal from "@/Components/Modal";
import SectionCard from "@/Components/SectionCard";
import YearSelector from "@/Components/YearSelector";
import { useModal } from "@/hooks/useModal";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ImportStudentForm from "@/Sections/Admin/Classrooms/ImportStudentForm";
import SectionForm from "@/Sections/Admin/Classrooms/SectionForm";
import { AcademicYear, Grade, Section, Student, Teacher } from "@/types";
import { filterUnassignedTeachers, transformTeachers } from "@/utils";
import { Head, router, usePage } from "@inertiajs/react";
import { Upload, XIcon } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

type Props = {
    year: string;
    teachers: Teacher[];
    selectedYear: AcademicYear;
    students: Student[];
};

const Classrooms = ({ teachers, selectedYear, students }: Props) => {
    const { academicYears, activeTeachers } = usePage().props;
    const [currentYear, setCurrentYear] = useState<AcademicYear>(selectedYear);
    const { showModal, openModal, closeModal, formContent } = useModal();

    const handleYearChange = (newYear: AcademicYear) => {
        setCurrentYear(newYear);
        // Actualizar la URL con el nuevo año y hacer la petición solo para 'teachers'
        router.visit(`/admin/aulas/${newYear.year}`, {
            only: ["teachers", "selectedYear"],
        });
    };

    const grades = transformTeachers(teachers);
    const unassignedTeachers = filterUnassignedTeachers(
        activeTeachers,
        teachers
    );

    const handleAddSection = (grade: Grade) => {
        if (grade.sections.length === 5) {
            Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "No puedes añadir más de 5 secciones a un grado",
            });
            return;
        }
        openModal(
            <SectionForm
                grade={grade}
                academicYear={currentYear}
                onCloseModal={closeModal}
                assignedTeachers={teachers}
            />
        );
    };

    const handleEditSection = (grade: Grade, section: Section) => {
        openModal(
            <SectionForm
                grade={grade}
                academicYear={currentYear}
                onCloseModal={closeModal}
                assignedTeachers={teachers}
                sectionName={section.name}
                userId={section.userId}
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
                    only: ["teachers", "students"],
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

    const handleImportStudents = (grade: Grade, section: string) => {
        openModal(
            <ImportStudentForm
                academicYearId={currentYear.id}
                grade={grade.name}
                section={section}
                onCloseModal={closeModal}
            />
        );
    };

    const handleShowStudents = (grade: Grade, section: Section) => {
        openModal(
            <div>
                <h2 className="mb-4 text-xl font-semibold text-center text-gray-700 sm:text-2xl dark:text-gray-100">
                    Lista de estudiantes
                </h2>
                <ol className="px-4 mb-4 overflow-auto text-gray-700 list-decimal max-h-96 dark:text-gray-100">
                    {students
                        .filter(
                            (student) =>
                                student.grade == grade.name &&
                                student.section == section.name
                        )
                        .map((student) => (
                            <li key={student.id} className="ml-3">
                                {student.name}
                            </li>
                        ))}
                </ol>
                <div className="px-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 mb-4 text-gray-100 bg-blue-500 rounded-md"
                        onClick={() =>
                            handleImportStudents(grade, section.name)
                        }
                    >
                        <Upload size={16} className="mr-2" />
                        Volver a importar estudiantes
                    </button>
                </div>
            </div>
        );
    };

    return (
        <Authenticated>
            <Head title="Aulas" />
            <div className="py-12">
                <h1 className="px-4 mb-6 text-2xl font-bold text-center text-blue-800 sm:text-3xl sm:mb-8 dark:text-blue-300">
                    Gestión de Aulas y Docentes
                </h1>
                <YearSelector
                    years={academicYears}
                    selectedYear={currentYear}
                    setSelectedYear={handleYearChange}
                />
                {/* Aquí iteras sobre los grados y profesores */}
                <div className="px-4 mx-auto mt-6 sm:mt-8 max-w-7xl">
                    {grades.length > 0 &&
                        grades.map((grade) => (
                            <GradeCollapse
                                key={grade.name}
                                grade={grade}
                                showAddButton={
                                    grade.sections.length < 5 &&
                                    unassignedTeachers.length !== 0
                                }
                                onAddButtonClick={handleAddSection}
                            >
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {grade.sections
                                        .sort((a, b) =>
                                            a.name.localeCompare(b.name)
                                        )
                                        .map((section) => (
                                            <SectionCard
                                                key={section.id}
                                                grade={grade}
                                                section={section}
                                                students={students}
                                                handleEditSection={() =>
                                                    handleEditSection(
                                                        grade,
                                                        section
                                                    )
                                                }
                                                handleDeleteSection={
                                                    handleDeleteSection
                                                }
                                                handleImportStudents={() =>
                                                    handleImportStudents(
                                                        grade,
                                                        section.name
                                                    )
                                                }
                                                handleShowStudents={
                                                    handleShowStudents
                                                }
                                            />
                                        ))}
                                </div>
                            </GradeCollapse>
                        ))}
                </div>
            </div>
            <Modal
                show={showModal}
                onClose={closeModal}
                maxWidth="lg"
                closeable={false}
            >
                <div className="relative px-4 py-4 sm:px-6">
                    <XIcon
                        className="absolute text-gray-500 cursor-pointer top-4 right-4 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        onClick={closeModal}
                    />
                    {formContent}
                </div>
            </Modal>
        </Authenticated>
    );
};

export default Classrooms;
