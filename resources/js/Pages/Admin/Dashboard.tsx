import Authenticated from "@/Layouts/AuthenticatedLayout";
import WithoutAcademicYears from "@/Sections/WithoutAcademicYears";
import { Head, usePage } from "@inertiajs/react";

const Dashboard = () => {
    const { academicYears } = usePage().props;
    return (
        <Authenticated>
            <Head title="Inicio" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {academicYears.length > 0 ? (
                        <>
                            <h1 className="text-center text-gray-100 font-4xl">
                                Vista de administrador
                            </h1>
                            <ul>
                                {academicYears.map((academicYear) => (
                                    <li key={academicYear.id}>
                                        {academicYear.year}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <WithoutAcademicYears />
                    )}
                </div>
            </div>
        </Authenticated>
    );
};

export default Dashboard;
