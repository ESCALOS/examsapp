import ExamReviewCard from "@/Components/ExamViewCard";
import Modal from "@/Components/Modal";
import YearSelector from "@/Components/YearSelector";
import { useModal } from "@/hooks/useModal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ExamForm from "@/Sections/Teacher/ExamForm";
import { AcademicYear, Exam, Student } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";

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
        console.log(exam);
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
                                const evaluatedStudents = new Set(
                                    exam.answers.map(
                                        (answer) => answer.student_id
                                    )
                                ).size;

                                const state =
                                    evaluatedStudents === students.length
                                        ? "complete"
                                        : "evaluating";
                                return (
                                    <ExamReviewCard
                                        key={exam.id}
                                        examName={exam.name}
                                        status={state}
                                        totalStudents={students.length}
                                        evaluatedStudents={evaluatedStudents}
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
