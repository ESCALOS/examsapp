import { AcademicYear, Grade, Question, QuestionModel } from "@/types";
import {
    createQuestions,
    transformQuestions,
    validateQuestions,
} from "@/utils";
import { useForm } from "@inertiajs/react";
import { Minus, Plus } from "lucide-react";
import Swal from "sweetalert2";

type Props = {
    examId?: number;
    name?: string;
    grade: string;
    academicYear: AcademicYear;
    questionsNumber: number;
    closeModal: () => void;
    questions?: QuestionModel[];
};

type FormProps = {
    id?: number;
    name: string;
    grade: string;
    academicYearId: number;
    questions: Question[];
};

export default function ExamForm({
    examId,
    name,
    grade,
    academicYear,
    questionsNumber,
    closeModal,
    questions,
}: Props) {
    const formName = examId === undefined ? "CreateExam" : `EditExam${examId}`;
    const { data, setData, post, processing, isDirty } = useForm<FormProps>(
        formName,
        {
            id: examId,
            name: name || "",
            grade: grade,
            academicYearId: academicYear.id,
            questions:
                questions === undefined
                    ? createQuestions(questionsNumber)
                    : transformQuestions(questions),
        }
    );
    const validAnswers = ["A", "B", "C", "D", "E"];

    const addQuestion = () => {
        setData("questions", [
            ...data.questions,
            { id: data.questions.length + 1, correctAnswer: null },
        ]);
    };

    const removeQuestion = () => {
        if (data.questions.length > 1) {
            setData("questions", data.questions.slice(0, -1));
        }
    };

    const handleAnswerSelection = (
        questionId: number,
        answer: string | null
    ) => {
        setData(
            "questions",
            data.questions.map((q) =>
                q.id === questionId ? { ...q, correctAnswer: answer } : q
            )
        );
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { idError: id, areErrors } = validateQuestions(
            validAnswers,
            data.questions
        );
        if (areErrors) {
            Swal.fire({
                title: `Falta marcar la alternativa en la pregunta ${id}`,
                icon: "info",
            });
            return;
        }
        const uri =
            examId === undefined
                ? route("admin.exams.add-exam")
                : route("admin.exams.update-exam");
        post(uri, {
            preserveScroll: true,
            only: ["exams"],
            onProgress: () => {
                // Si la solicitud está en curso
                Swal.fire({
                    icon: "info",
                    title:
                        examId === undefined
                            ? "Creando examen..."
                            : "Actualizando examen",
                    text:
                        examId === undefined
                            ? "El examen se está creando"
                            : "El examense está actualizando",
                });
            },
            onSuccess: () => {
                // Si la solicitud fue exitosa
                Swal.fire({
                    icon: "success",
                    title:
                        examId === undefined
                            ? "¡Examen Creado!"
                            : "¡Examen Actualizado!",
                    text: "El examen se creó exitosamente",
                });
                closeModal();
            },
            onError: (page) => {
                // Si hubo algún error, mostrarlo en SweetAlert
                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text: "Hubo un problema",
                });
            },
        });
    };
    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <h2 className="mb-4 text-xl font-semibold text-center text-gray-700 sm:text-2xl dark:text-gray-100">
                {examId === undefined ? "Nuevo Examen" : "Editar Examen"}
            </h2>
            {isDirty && (
                <div className="text-amber-500">* Hay cambios sin guardar</div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-4">
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Nombre del Examen"
                    className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                />
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={addQuestion}
                        className="p-2 text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
                    >
                        <Plus size={20} />
                    </button>
                    <button
                        type="button"
                        onClick={removeQuestion}
                        className="p-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
                        disabled={data.questions.length === 1}
                    >
                        <Minus size={20} />
                    </button>
                </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto pr-2 flex justify-center flex-wrap gap-4">
                {data.questions.map((question) => (
                    <div
                        key={question.id}
                        className="p-4 border dark:border-gray-700"
                    >
                        <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            Pregunta {question.id}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {["A", "B", "C", "D", "E"].map((answer) => (
                                <button
                                    key={answer}
                                    type="button"
                                    onClick={() =>
                                        handleAnswerSelection(
                                            question.id,
                                            answer
                                        )
                                    }
                                    className={`px-3 py-1 text-sm rounded-md ${
                                        question.correctAnswer === answer
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                    } hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors`}
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                    disabled={processing}
                >
                    {examId === undefined
                        ? "Crear Examen"
                        : "Actualizar Examen"}
                </button>
            </div>
        </form>
    );
}
