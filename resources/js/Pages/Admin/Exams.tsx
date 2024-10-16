import Modal from "@/Components/Modal";
import YearSelector from "@/Components/YearSelector";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { AcademicYear, Exam } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { XIcon } from "lucide-react";
import { ReactNode, useState } from "react";

type Props = {
    year: string;
    selectedYear: AcademicYear;
    exams: Exam[];
};

const Exams = ({ selectedYear, exams }: Props) => {
    const { academicYears } = usePage().props;
    const [currentYear, setCurrentYear] = useState<AcademicYear>(selectedYear);
    const [showModal, setShowModal] = useState(false);
    const [formContent, setFormContent] = useState<ReactNode>(null);

    const handleYearChange = (newYear: AcademicYear) => {
        setCurrentYear(newYear);
        // Actualizar la URL con el nuevo año y hacer la petición solo para 'teachers'
        router.visit(`/admin/examenes/${newYear.year}`);
    };

    return (
        <>
            <Head title="Exámenes" />
            <div className="py-12">
                <h1 className="px-4 mb-6 text-2xl font-bold text-center text-blue-800 sm:text-3xl sm:mb-8 dark:text-blue-300">
                    Gestión de Aulas y Docentes
                </h1>
                <YearSelector
                    years={academicYears}
                    selectedYear={currentYear}
                    setSelectedYear={handleYearChange}
                />
                <div className="px-4 mx-auto mt-6 sm:mt-8 max-w-7xl"></div>
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

Exams.layout = (page: ReactNode) => <Authenticated children={page} />;

export default Exams;
