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
        Swal.showLoading(Swal.getDenyButton());
        fetch(
            route("teacher.exams.show-evaluated-students-by-exam", {
                examId: exam.id,
                academicYearId: currentYear.id,
            })
        )
            .then((response) => {
                // Verifica si la respuesta es correcta (status 200)
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json(); // Parsea la respuesta JSON
            })
            .then((data) => {
                const exam = {
                    id: data.id,
                    name: data.name,
                };
                openModal(
                    <ExamForm
                        exam={exam}
                        students={students}
                        evaluatedStudentIds={data.evaluated_student_ids}
                        onClose={closeModal}
                        questionCount={data.questions_count || 0}
                    />
                );
                Swal.close();
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error al cargar las preguntas",
                    text: "Revisa tu conexión y vuelve a intentarlo",
                });
                console.error("Error fetching data:", error); // Manejo de errores
            });
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
        // const rankingList = generateRanking(exam);
        // openModal(

        // );
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
                                    students.length === exam.students_evaluated
                                        ? "complete"
                                        : "evaluating";
                                return (
                                    <ExamReviewCard
                                        key={exam.id}
                                        examName={exam.name}
                                        status={state}
                                        totalStudents={students.length}
                                        evaluatedStudents={
                                            exam.students_evaluated
                                        }
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
