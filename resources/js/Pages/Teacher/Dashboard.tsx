import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import WithoutAcademicYears from "@/Sections/WithoutAcademicYears";
import { AcademicYear, Student, Teacher } from "@/types";
import { Head } from "@inertiajs/react";

type Props = {
    academicYears: AcademicYear[];
    teachers: Teacher[];
    students: Student[];
};

export default function Dashboard({ academicYears }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Inicio" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {academicYears.length >= 2 ? (
                        <h1 className="text-center text-gray-100 font-4xl">
                            Vista de docentes
                        </h1>
                    ) : (
                        <WithoutAcademicYears />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
