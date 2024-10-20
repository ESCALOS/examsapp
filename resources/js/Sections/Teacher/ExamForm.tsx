import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Exam, Student } from "@/types";
import StudentList from "./StudentList";
import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { MdiExchange } from "@/Components/Icons/MdiExchange";
import { separateStudents } from "@/utils";
import QuestionContainer from "./QuestionContainer";

interface ExamFormProps {
    exam: Exam;
    students: Student[];
    questionCount: number;
    onClose: () => void;
    evaluatedStudentIds: number[];
    onEvaluateStudent: () => void;
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
    evaluatedStudentIds,
    onEvaluateStudent,
}) => {
    const { data, setData, post, processing } = useForm<FormProps>(
        `ReviewExam${exam.id}`,
        {
            student: null,
            exam: exam,
            answers: Array(questionCount).fill(null),
        }
    );

    const { evaluated, notEvaluated } = separateStudents(
        students,
        evaluatedStudentIds
    );

    const [evaluatedStudents, setEvaluatedStudents] =
        useState<Student[]>(evaluated);
    const [notEvaluatedStudents, setNotEvaluatedStudents] =
        useState<Student[]>(notEvaluated);

    const [showEvaluated, setShowEvaluated] = useState(
        notEvaluatedStudents.length === 0
    );

    const handleStudentSelect = (student: Student) => {
        if (showEvaluated) {
            // Encuentra las respuestas del estudiante seleccionado si ya existen
            Swal.showLoading(Swal.getDenyButton());
            fetch(
                route("teacher.exams.show-answers-by-student", {
                    examId: exam.id,
                    studentId: student.id,
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
                    setData((prevData) => ({
                        ...prevData,
                        student: student,
                        answers: data,
                    }));
                    Swal.close();
                })
                .catch((error) => {
                    Swal.fire({
                        icon: "error",
                        title: "Error al cargar las respuestas",
                        text: "Revisa tu conexión y vuelve a intentarlo",
                    });
                    console.error("Error fetching data:", error); // Manejo de errores
                });
        } else {
            setData((prevData) => ({
                ...prevData,
                student: student,
                answers: Array(questionCount).fill(null),
            }));
        }
    };

    const handleBackToList = () => {
        if (notEvaluated.length === 1) {
            setShowEvaluated(true);
            Swal.fire({
                icon: "success",
                title: "¡Todos los estudiantes han sido evaluados!",
                text: "¡Ya puedes ver la tabla de puntajes!",
            });
        }

        setData("student", null);
    };

    // Función para mover un estudiante de no evaluado a evaluado
    const markAsEvaluated = (studentId: number) => {
        // Buscar el estudiante en el array de no evaluados
        const studentToEvaluate = notEvaluatedStudents.find(
            (student) => student.id === studentId
        );

        if (studentToEvaluate) {
            // Actualizar el estado
            setEvaluatedStudents((prevEvaluated) => [
                ...prevEvaluated,
                studentToEvaluate,
            ]); // Añadir al array de evaluados

            // Remover del array de no evaluados
            setNotEvaluatedStudents((prevNotEvaluated) =>
                prevNotEvaluated.filter((student) => student.id !== studentId)
            );
        }
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
            Swal.showLoading(Swal.getDenyButton());
            const uri = route("teacher.exams.review");
            post(uri, {
                preserveState: true,
                only: [],
                onSuccess: () => {
                    if (!showEvaluated && data.student) {
                        markAsEvaluated(data.student.id);
                        onEvaluateStudent();
                    }

                    if (notEvaluatedStudents.length === 1) {
                        setData("student", null);
                        Swal.fire({
                            title: "¡Todos los estudiantes han sido evaluados!",
                            text: "¡Ya puedes ver la tabla de puntajes!",
                            icon: "success",
                            confirmButtonText: "Aceptar",
                        });
                        onClose();
                    } else {
                        Swal.fire({
                            title: "Evaluación guardada",
                            icon: "success",
                            confirmButtonText: "Aceptar",
                        });
                        handleBackToList();
                    }
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
                    <QuestionContainer
                        answers={data.answers}
                        handleAnswerSelection={handleAnswerSelection}
                    />
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
