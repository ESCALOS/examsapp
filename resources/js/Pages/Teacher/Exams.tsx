import ExamReviewCard from "@/Components/ExamViewCard";
import Modal from "@/Components/Modal";
import YearSelector from "@/Components/YearSelector";
import { useModal } from "@/hooks/useModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ExamForm from "@/Sections/Teacher/ExamForm";
import { AcademicYear, Exam, Student } from "@/types";
import { generateRanking } from "@/utils";
import { Head, router, usePage } from "@inertiajs/react";
import { X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

type Props = {
    year: string;
    selectedYear: AcademicYear;
    exams: Exam[];
    students: Student[];
};

export default function Exams({ selectedYear, exams, students }: Props) {
    const { academicYears, auth } = usePage().props;
    const [currentYear, setCurrentYear] = useState<AcademicYear>(selectedYear);
    const { showModal, formContent, openModal, closeModal } = useModal();

    const currentTeacherData = auth.user.teachers?.find(
        (teacher) => teacher.academic_year_id === currentYear.id
    );

    const handleYearChange = (newYear: AcademicYear) => {
        setCurrentYear(newYear);
        // Actualizar la URL con el nuevo año y hacer la petición solo para 'teachers'
        router.visit(`/docente/${newYear.year}`, {
            preserveScroll: true,
            only: ["exams", "selectedYear"],
        });
    };

    const handleEvaluate = (exam: Exam) => {
        openModal(
            <ExamForm
                exam={exam}
                students={students}
                onClose={closeModal}
                questionCount={exam.questions.length}
            />
        );
    };

    const handleViewRanking = (exam: Exam) => {
        if (true) {
            Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "Revisa algún examen primero",
            });
            return;
        }
        const rankingList = generateRanking(exam);
        openModal(
            <div className="w-full max-w-3xl p-6 overflow-y-auto bg-white rounded-lg dark:bg-gray-800 dark:text-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Clasificación de estudiantes
                    </h2>

                    <button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="flex flex-col gap-4 max-h-[60vh] overflow-x-auto">
                    {rankingList.map((item, index) => (
                        <div
                            key={index}
                            className={`relative shadow-lg rounded-lg p-6 flex items-center space-x-4 border-l-8
                            ${
                                item.rank === 1
                                    ? "bg-yellow-100 border-yellow-500 dark:bg-yellow-700"
                                    : ""
                            }
                            ${
                                item.rank === 2
                                    ? "bg-gray-100 border-gray-500 dark:bg-gray-700"
                                    : ""
                            }
                            ${
                                item.rank > 2
                                    ? "bg-white dark:bg-gray-800 border-indigo-500 dark:border-indigo-400"
                                    : ""
                            }`}
                        >
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                                    {item.student.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-bold text-green-600 dark:text-green-400">
                                        {item.correct}
                                    </span>{" "}
                                    correctas,{" "}
                                    <span className="font-bold text-red-600 dark:text-red-400">
                                        {item.incorrect}
                                    </span>{" "}
                                    incorrectas
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    return (
        <AuthenticatedLayout>
            <Head title="Inicio" />

            <Head title="Exámenes" />
            <div className="py-12">
                <div className="px-4 mb-6 sm:mb-8 ">
                    <h1 className="text-2xl font-bold text-center text-blue-800 sm:text-3xl dark:text-blue-300">
                        Gestión de Examenes
                    </h1>
                    <h2 className="text-lg font-medium text-center text-gray-600 dark:text-gray-400">
                        Aula:{" "}
                        {currentTeacherData
                            ? `${currentTeacherData.grade}° "${currentTeacherData.section}"`
                            : "Sin aula seleccionada"}
                    </h2>
                </div>
                <YearSelector
                    years={academicYears}
                    selectedYear={currentYear}
                    setSelectedYear={handleYearChange}
                />

                <div className="px-4 mx-auto mt-6 sm:mt-8 max-w-7xl">
                    {exams.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {exams.map((exam) => {
                                const state =
                                    students.length === 2
                                        ? "complete"
                                        : "evaluating";
                                return (
                                    <ExamReviewCard
                                        key={exam.id}
                                        examName={exam.name}
                                        status={state}
                                        totalStudents={students.length}
                                        evaluatedStudents={2}
                                        onEvaluate={() => handleEvaluate(exam)}
                                        onViewRankings={() =>
                                            handleViewRanking(exam)
                                        }
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 dark:bg-gray-700">
                            <div className="flex items-center justify-center">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No hay exámenes disponibles para este grado
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Modal show={showModal} onClose={closeModal} closeable={false}>
                {formContent}
            </Modal>
        </AuthenticatedLayout>
    );
}
