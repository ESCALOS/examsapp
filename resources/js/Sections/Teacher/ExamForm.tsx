import React, { useEffect, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Exam, Student } from "@/types";
import StudentList from "./StudentList";
import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { MdiExchange } from "@/Components/Icons/MdiExchange";
import { useEvaluatedStudents } from "@/hooks/useEvaluatedStudents";
interface ExamFormProps {
    exam: Exam;
    students: Student[];
    questionCount: number;
    onClose: () => void;
}

interface FormProps {
    student: Student | null;
    exam: Exam;
    answers: (string | null)[];
}

const ExamForm: React.FC<ExamFormProps> = ({
    exam,
    students,
    questionCount,
    onClose,
}) => {
    const { data, setData, post, processing } = useForm<FormProps>(
        `ReviewExam${exam.id}`,
        {
            student: null,
            exam: exam,
            answers: Array(questionCount).fill(null),
        }
    );
    // Inicializa el estado examAnswers a partir de data.exam
    const [examAnswers, setExamAnswers] = useState<{ student_id: number }[]>(
        exam.answers.map((answer) => ({
            student_id: answer.student_id,
        }))
    );

    const { evaluatedStudents, notEvaluatedStudents } = useEvaluatedStudents(
        examAnswers,
        students
    );

    const [showEvaluated, setShowEvaluated] = useState(
        notEvaluatedStudents.length === 0
    );
    const handleStudentSelect = (student: Student) => {
        // Encuentra las respuestas del estudiante seleccionado si ya existen
        const existingAnswers = exam.answers.filter(
            (answer) => answer.student_id === student.id
        );

        // Si hay respuestas previas, crea un array con las respuestas en el índice correcto
        const prefilledAnswers = Array(questionCount).fill(null);
        existingAnswers.forEach((answer) => {
            prefilledAnswers[answer.question_number - 1] = answer.answer;
        });

        // Actualiza los datos del formulario con el estudiante y las respuestas prellenadas
        setData((prevData) => ({
            ...prevData,
            student: student,
            answers: prefilledAnswers,
        }));
    };

    const handleBackToList = () => {
        if (notEvaluatedStudents.length === 1) {
            setShowEvaluated(true);
            Swal.fire({
                icon: "success",
                title: "¡Todos los estudiantes han sido evaluados!",
                text: "¡Ya puedes ver la tabla de puntajes!",
            });
        }

        setData("student", null);
    };

    const handleAnswerSelection = (
        questionIndex: number,
        selectedAnswer: string
    ) => {
        const newAnswers = [...data.answers];

        // Si la respuesta actual es la misma que el botón presionado, se desmarca
        if (newAnswers[questionIndex] === selectedAnswer) {
            newAnswers[questionIndex] = null; // Desmarcar
        } else {
            newAnswers[questionIndex] = selectedAnswer; // Marcar
        }

        setData("answers", newAnswers);
    };

    const handleSaveReview = () => {
        if (data.student) {
            const uri = route("teacher.exams.review");
            post(uri, {
                preserveScroll: true,
                only: ["exams"],
                onProgress: () => {
                    Swal.fire({
                        title: "Guardando evaluación",
                        icon: "info",
                        confirmButtonText: "Aceptar",
                    });
                },
                onSuccess: (page) => {
                    Swal.fire({
                        title: "Evaluación guardada",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                    });
                    // Extrae las nuevas respuestas desde la respuesta del servidor
                    const updatedAnswers =
                        page.props.exams.find((e: Exam) => e.id === exam.id)
                            ?.answers || [];

                    exam.answers = updatedAnswers;

                    // Actualiza el estado examAnswers
                    setExamAnswers(
                        updatedAnswers.map((answer) => ({
                            student_id: answer.student_id,
                        }))
                    );

                    handleBackToList();
                },
                onError: () => {
                    Swal.fire({
                        title: "Error al guardar la evaluación",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                    });
                },
            });
        }
    };

    return (
        <div className="w-full max-w-3xl p-6 overflow-y-auto bg-white rounded-lg dark:bg-gray-800 dark:text-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {data.student
                            ? `Revisión: ${data.student.name}`
                            : showEvaluated
                            ? `Alumnos evaluados`
                            : `Alumnos sin evaluar`}
                    </h2>
                    {notEvaluatedStudents.length > 0 &&
                        evaluatedStudents.length > 0 && (
                            <button
                                onClick={() => setShowEvaluated(!showEvaluated)}
                            >
                                <MdiExchange
                                    width={20}
                                    height={20}
                                    className="text-amber-500 hover:text-amber-600 dark:hover:text-amber-400"
                                />
                            </button>
                        )}
                </div>

                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X size={20} />
                </button>
            </div>

            {data.student != null ? (
                <div>
                    <button
                        onClick={handleBackToList}
                        className="flex items-center mb-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Volver a la lista
                    </button>
                    <div className="max-h-[60vh] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-2 justify-center items-center max-w-2xl">
                        {Array.from({ length: questionCount }, (_, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center justify-center py-2 border dark:border-gray-700"
                            >
                                <p className="mb-2 font-medium">
                                    Pregunta {index + 1}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {["A", "B", "C", "D", "E"].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() =>
                                                handleAnswerSelection(
                                                    index,
                                                    option
                                                )
                                            }
                                            className={`px-3 py-1 text-sm rounded-md ${
                                                option === data.answers[index]
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                            } hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleSaveReview}
                            className="px-4 py-2 text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
                            disabled={processing}
                        >
                            Guardar Revisión
                        </button>
                    </div>
                </div>
            ) : (
                <StudentList
                    evaluatedStudents={evaluatedStudents}
                    notEvaluatedStudents={notEvaluatedStudents}
                    onStudentSelect={handleStudentSelect}
                    showEvaluated={showEvaluated}
                />
            )}
        </div>
    );
};

export default ExamForm;
