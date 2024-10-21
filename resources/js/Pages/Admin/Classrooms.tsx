import GradeCollapse from "@/Components/GradeCollapse";
import Modal from "@/Components/Modal";
import SectionCard from "@/Components/SectionCard";
import YearSelector from "@/Components/YearSelector";
import { useModal } from "@/hooks/useModal";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import SectionForm from "@/Sections/Admin/Classrooms/SectionForm";
import WithoutAcademicYears from "@/Sections/WithoutAcademicYears";
import { AcademicYear, Grade, Teacher, User } from "@/types";
import { availableSections, groupBySections } from "@/utils";
import { Head, router, usePage } from "@inertiajs/react";
import { XIcon } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

type Props = {
    year: string;
    assignedTeachers: Teacher[];
    unassignedTeachers: User[];
    selectedYear: AcademicYear;
};

const Classrooms = ({
    assignedTeachers,
    unassignedTeachers,
    selectedYear,
}: Props) => {
    const { academicYears } = usePage().props;
    const [currentYear, setCurrentYear] = useState<AcademicYear>(selectedYear);
    const { showModal, openModal, closeModal, formContent } = useModal();

    const handleYearChange = (newYear: AcademicYear) => {
        setCurrentYear(newYear);
        // Actualizar la URL con el nuevo año y hacer la petición solo para 'teachers'
        router.visit(`/admin/aulas/${newYear.year}`, {
            only: ["teachers", "selectedYear"],
        });
    };

    const grades = groupBySections(assignedTeachers);

    const handleAddSection = (grade: Grade) => {
        const sections = availableSections(grade.sections);
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
                unassignedTeachers={unassignedTeachers}
                sections={sections}
            />
        );
    };

    return (
        <Authenticated>
            <Head title="Aulas" />
            {academicYears.length > 0 ? (
                <>
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
                            {grades
                                .sort((a, b) => a.name - b.name)
                                .map((grade) => (
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
                                                        key={section.name}
                                                        grade={grade}
                                                        section={section}
                                                        openModal={openModal}
                                                        closeModal={closeModal}
                                                        currentYear={
                                                            currentYear
                                                        }
                                                        assignedTeachers={
                                                            assignedTeachers
                                                        }
                                                        unassignedTeachers={
                                                            unassignedTeachers
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
                </>
            ) : (
                <WithoutAcademicYears />
            )}
        </Authenticated>
    );
};

export default Classrooms;
