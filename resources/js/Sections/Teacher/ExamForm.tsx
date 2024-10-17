import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { Exam, Student } from "@/types";
import StudentList from "./StudentList";
interface ExamFormProps {
    exam: Exam;
    students: Student[];
    questionCount: number;
    onClose: () => void;
    onSaveEvaluation: (studentId: number, answers: (string | null)[]) => void;
}

const ExamForm: React.FC<ExamFormProps> = ({
    exam,
    students,
    questionCount,
    onClose,
    onSaveEvaluation,
}) => {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null
    );
    const [answers, setAnswers] = useState<(string | null)[]>(
        Array(questionCount).fill("")
    );

    const handleStudentSelect = (student: Student) => {
        setSelectedStudent(student);
        setAnswers(Array(questionCount).fill(""));
    };

    const handleBackToList = () => {
        setSelectedStudent(null);
    };

    const handleAnswerSelection = (
        questionIndex: number,
        selectedAnswer: string
    ) => {
        const newAnswers = [...answers];

        // Si la respuesta actual es la misma que el botón presionado, se desmarca
        if (newAnswers[questionIndex] === selectedAnswer) {
            newAnswers[questionIndex] = null; // Desmarcar
        } else {
            newAnswers[questionIndex] = selectedAnswer; // Marcar
        }

        setAnswers(newAnswers);
    };

    const handleSaveReview = () => {
        if (selectedStudent) {
            onSaveEvaluation(selectedStudent.id, answers);
            console.log("Examen desde form", exam);
            handleBackToList();
        }
    };

    return (
        <div className="w-full max-w-3xl p-6 overflow-y-auto bg-white rounded-lg dark:bg-gray-800 dark:text-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedStudent
                        ? `Revisión: ${selectedStudent.name}`
                        : `Revisión de ${exam.name}`}
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X size={20} />
                </button>
            </div>

            {selectedStudent ? (
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
                                                option === answers[index]
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
                        >
                            Guardar Revisión
                        </button>
                    </div>
                </div>
            ) : (
                <StudentList
                    students={students}
                    onStudentSelect={handleStudentSelect}
                />
            )}
        </div>
    );
};

export default ExamForm;
