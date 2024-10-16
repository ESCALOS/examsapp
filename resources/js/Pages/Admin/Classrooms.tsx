import GradeCollapse from "@/Components/GradeCollapse";
import YearSelector from "@/Components/YearSelector";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { AcademicYear, Teacher } from "@/types";
import { transformTeachers } from "@/utils";
import { Head, router } from "@inertiajs/react";
import { ReactNode, useEffect, useState } from "react";

type Props = {
    year: string;
    teachers: Teacher[];
    academicYears: AcademicYear[];
    selectedYear: AcademicYear;
};

const Classrooms = ({ teachers, academicYears, selectedYear }: Props) => {
    const [currentYear, setCurrentYear] = useState<AcademicYear>(selectedYear);

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
                <h1 className="mb-6 text-2xl font-bold text-center text-blue-800 sm:text-3xl sm:mb-8 dark:text-blue-300">
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
                            <GradeCollapse key={grade.name} grade={grade} />
                        ))}
                </div>
            </div>
        </>
    );
};

Classrooms.layout = (page: ReactNode) => <Authenticated children={page} />;

export default Classrooms;
