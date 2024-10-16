import GradeCollapse from "@/Components/GradeCollapse";
import Modal from "@/Components/Modal";
import YearSelector from "@/Components/YearSelector";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import SectionForm from "@/Sections/Admin/Classrooms/SectionForm";
import { AcademicYear, Grade, Student, Teacher } from "@/types";
import { transformTeachers } from "@/utils";
import { Head, router } from "@inertiajs/react";
import { XIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import Swal from "sweetalert2";

type Props = {
    year: string;
    teachers: Teacher[];
    academicYears: AcademicYear[];
    selectedYear: AcademicYear;
    students: Student[];
};

const Classrooms = ({
    teachers,
    academicYears,
    selectedYear,
    students,
}: Props) => {
    const [currentYear, setCurrentYear] = useState<AcademicYear>(selectedYear);
    const [showModal, setShowModal] = useState(false);
    const [formContent, setFormContent] = useState<ReactNode>(null);

    const handleYearChange = (newYear: AcademicYear) => {
        setCurrentYear(newYear);
        // Actualizar la URL con el nuevo año y hacer la petición solo para 'teachers'
        router.visit(`/admin/aulas/${newYear.year}`, {
            only: ["teachers", "selectedYear"],
        });
    };

    const grades = transformTeachers(teachers);

    return (
        <>
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
                                setFormContent={setFormContent}
                                setShowModal={setShowModal}
                                students={students}
                                currentYear={currentYear}
                                teachers={teachers}
                            />
                        ))}
                </div>
            </div>
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                maxWidth="lg"
                closeable={true}
            >
                <div className="relative p-8">
                    <XIcon
                        className="absolute text-gray-500 cursor-pointer top-4 right-4 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        onClick={() => setShowModal(false)}
                    />
                    {formContent}
                </div>
            </Modal>
        </>
    );
};

Classrooms.layout = (page: ReactNode) => <Authenticated children={page} />;

export default Classrooms;
