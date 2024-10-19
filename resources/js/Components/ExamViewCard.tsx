import React, { useState } from "react";
import { CheckCircle, Clock, Award, SquareCheckBig } from "lucide-react";
import { AcademicYear, Exam, Student } from "@/types";
import Swal from "sweetalert2";
import ExamForm from "@/Sections/Teacher/ExamForm";
import RankedList from "@/Sections/Teacher/RankedList";

interface ExamReviewCardProps {
    exam: Exam;
    status: "complete" | "evaluating";
    currentYear: AcademicYear;
    students: Student[];
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
}

const ExamReviewCard: React.FC<ExamReviewCardProps> = ({
    exam,
    status,
    currentYear,
    students,
    openModal,
    closeModal,
}) => {
    const [evaluatedStudents, setEvaluatedStudents] = useState<number>(
        exam.students_evaluated
    );
    const progress = (evaluatedStudents / students.length) * 100;

    const handleIncrementEvaluatedStudents = () => {
        setEvaluatedStudents((prevEvaluated) => prevEvaluated + 1);
    };

    const handleEvaluate = () => {
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
                openModal(
                    <ExamForm
                        exam={exam}
                        students={students}
                        evaluatedStudentIds={data.evaluated_student_ids}
                        onClose={closeModal}
                        questionCount={data.questions_count || 0}
                        onEvaluateStudent={handleIncrementEvaluatedStudents}
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

    const handleViewRanking = () => {
        if (evaluatedStudents === 0) {
            Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "Revisa algún examen primero",
            });
            return;
        }

        Swal.showLoading(Swal.getDenyButton());
        fetch(
            route("teacher.exams.get-ranking-by-exam-and-section", {
                examId: exam.id,
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
                openModal(
                    <RankedList
                        rankingList={data.ranking}
                        closeModal={closeModal}
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

    return (
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {exam.name}
                </h3>
                <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                        status === "complete"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    }`}
                >
                    {status === "complete" ? (
                        <span className="flex items-center">
                            <CheckCircle size={14} className="mr-1" />
                            Completado
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            Evaluando
                        </span>
                    )}
                </span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-400">
                    <span>Progreso de evaluación</span>
                    <span>
                        {evaluatedStudents} / {students.length} estudiantes
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className={`h-2.5 rounded-full ${
                            progress == 100
                                ? "bg-green-500"
                                : progress < 50
                                ? "bg-red-500"
                                : "bg-amber-500"
                        }`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={handleEvaluate}
                    className="flex items-center justify-center flex-1 px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    <SquareCheckBig size={16} className="mr-2" />
                    Revisar Examen
                </button>
                <button
                    onClick={handleViewRanking}
                    className="flex items-center justify-center flex-1 px-4 py-2 text-sm text-white transition-colors bg-purple-500 rounded-md hover:bg-purple-600"
                >
                    <Award size={16} className="mr-2" />
                    Ver Ranking
                </button>
            </div>
        </div>
    );
};

export default ExamReviewCard;
