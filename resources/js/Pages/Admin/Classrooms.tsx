import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { ReactNode } from "react";

const Classrooms = () => {
    const { academicYears } = usePage().props;
    return (
        <>
            <Head title="Aulas" />
            <h1>Gestión de aulas y docentes</h1>
        </>
    );
};

Classrooms.layout = (page: ReactNode) => <Authenticated children={page} />;

export default Classrooms;
