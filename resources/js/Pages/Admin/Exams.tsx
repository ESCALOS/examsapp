import GradeCollapse from "@/Components/GradeCollapse";
import Modal from "@/Components/Modal";
import YearSelector from "@/Components/YearSelector";
import { useModal } from "@/hooks/useModal";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ExamForm from "@/Sections/Admin/Exams/ExamForm";
import { AcademicYear, Exam, ExamsByGrade } from "@/types";
import { groupExamsByGrade } from "@/utils";
import { Head, router, usePage } from "@inertiajs/react";
import { PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

type Props = {
    year: string;
    selectedYear: AcademicYear;
    exams: Exam[];
};

const Exams = ({ selectedYear, exams }: Props) => {
    const { academicYears } = usePage().props;
    const [currentYear, setCurrentYear] = useState<AcademicYear>(selectedYear);
    const { showModal, openModal, closeModal, formContent } = useModal();

    const grades = groupExamsByGrade(exams);
    const handleYearChange = (newYear: AcademicYear) => {
        setCurrentYear(newYear);
        // Actualizar la URL con el nuevo año y hacer la petición solo para 'teachers'
        router.visit(`/admin/examenes/${newYear.year}`);
    };

    const handleAddExam = (grade: ExamsByGrade, questionsNumber: number) => {
        openModal(
            <ExamForm
                academicYear={currentYear}
                grade={grade.name}
                questionsNumber={questionsNumber}
                closeModal={closeModal}
            />
        );
    };

    const handleEditExam = (grade: ExamsByGrade, exam: Exam) => {
        Swal.showLoading(Swal.getDenyButton());
        fetch(`/admin/examenes/mostrar-preguntas-por-examen/${exam.id}`)
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
                        academicYear={currentYear}
                        grade={grade.name}
                        questionsNumber={data.length}
                        closeModal={closeModal}
                        exam={exam}
                        questions={data}
                    />
                );
                Swal.close();
            })
            .catch((error) => {
                console.error("Error fetching data:", error); // Manejo de errores
            });
    };

    const handleDeleteExam = (id: number) => {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Esta acción no se puede deshacer",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar sección",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    title: "Eliminando...",
                    showConfirmButton: false,
                });
                router.visit(route("admin.exams.delete-exam"), {
                    method: "delete",
                    data: { id: id },
                    only: ["exams"],
                    preserveState: true,
                    onSuccess: () => {
                        // Si la solicitud fue exitosa
                        Swal.fire({
                            icon: "success",
                            title: "¡Eliminado!",
                            text: "El examen se ha eliminado correctamente",
                        });
                    },
                    onProgress: () => {
                        // Si la solicitud está en curso
                        Swal.fire({
                            icon: "info",
                            title: "Eliminando...",
                            text: "El examen se está eliminando",
                        });
                    },
                    onError: (page) => {
                        // Si hubo algún error, mostrarlo en SweetAlert
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text:
                                page.message ||
                                "Hubo un problema al eliminar el examen.",
                        });
                    },
                });
            }
        });
    };

    const setQuestionsNumber = async (grade: ExamsByGrade) => {
        const { value: questionsNumber } = await Swal.fire({
            title: "Ingresa la cantidad de preguntas",
            input: "text",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
            cancelButtonText: "Cancelar",
            inputValidator: (value) => {
                if (value === "" || isNaN(Number(value))) {
                    return "Debe ingresar un número válido";
                }
                if (Number(value) < 1) {
                    return "Debe ingresar un número mayor o igual a 1";
                }
                // Validación que sea entero
                if (Number(value) % 1 !== 0) {
                    return "Debe ingresar un número entero";
                }
                return null;
            },
        });

        if (questionsNumber) {
            handleAddExam(grade, questionsNumber);
        }
    };

    return (
        <Authenticated>
            <Head title="Exámenes" />
            <div className="py-12">
                <h1 className="px-4 mb-6 text-2xl font-bold text-center text-blue-800 sm:text-3xl sm:mb-8 dark:text-blue-300">
                    Gestión de Examenes
                </h1>
                <YearSelector
                    years={academicYears}
                    selectedYear={currentYear}
                    setSelectedYear={handleYearChange}
                />

                <div className="px-4 mx-auto mt-6 sm:mt-8 max-w-7xl">
                    {grades.map((grade) => (
                        <GradeCollapse
                            key={grade.name}
                            grade={grade}
                            showAddButton={true}
                            onAddButtonClick={setQuestionsNumber}
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {grade.exams.length > 0 ? (
                                    grade.exams.map((exam) => (
                                        <div
                                            key={exam.id}
                                            className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800"
                                        >
                                            <div className="flex flex-wrap items-center justify-between h-full gap-2">
                                                <p>{exam.name}</p>
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleEditExam(
                                                                grade,
                                                                exam
                                                            )
                                                        }
                                                    >
                                                        <PencilIcon
                                                            size={20}
                                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                        />
                                                    </button>

                                                    <button
                                                        title="Eliminar examen"
                                                        onClick={() =>
                                                            handleDeleteExam(
                                                                exam.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2Icon
                                                            size={20}
                                                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700">
                                        <div className="flex items-center justify-center">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                No hay exámenes disponibles para
                                                este grado
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </GradeCollapse>
                    ))}
                </div>
            </div>
            <Modal show={showModal} onClose={closeModal} closeable={false}>
                <div className="relative px-4 py-4 sm:px-6">
                    <XIcon
                        className="absolute text-gray-500 cursor-pointer top-4 right-4 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        onClick={closeModal}
                    />
                    {formContent}
                </div>
            </Modal>
        </Authenticated>
    );
};

export default Exams;
