import { router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";

type Props = {
    students: {
        id: number;
        name: string;
    }[];
};

function StudentList({ students }: Props) {
    const [studentsToDelete, setStudentsToDelete] =
        useState<{ id: number; name: string }[]>(students);

    const deleteStudent = (id: number) => {
        setStudentsToDelete((prev) =>
            prev.filter((student) => student.id !== id)
        );
    };

    const handleDeleteStudent = (studentId: number) => {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "Esta acción no se puede deshacer",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar estudiante",
        }).then((result) => {
            if (result.isConfirmed) {
                router.visit(route("admin.classrooms.delete-student"), {
                    method: "delete",
                    data: { id: studentId },
                    only: ["assignedTeachers"],
                    preserveState: true,
                    onProgress: () => {
                        // Si la solicitud está en curso
                        Swal.fire({
                            icon: "info",
                            title: "Eliminando...",
                            text: "El estudiante se está eliminando",
                        });
                    },
                    onSuccess: () => {
                        // Si la solicitud fue exitosa
                        Swal.fire({
                            icon: "success",
                            title: "¡Eliminado!",
                            text: "El estudiante se ha eliminado correctamente",
                        });
                        deleteStudent(studentId);
                    },
                    onError: (page) => {
                        // Si hubo algún error, mostrarlo en SweetAlert
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text:
                                page.message ||
                                "Hubo un problema al eliminar El estudiante.",
                        });
                    },
                });
            }
        });
    };
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold text-center text-gray-700 sm:text-2xl dark:text-gray-100">
                Lista de estudiantes
            </h2>
            <ol className="px-4 mb-4 overflow-auto text-gray-700 list-decimal max-h-96 dark:text-gray-100">
                {studentsToDelete.length > 0 ? (
                    studentsToDelete.map((student) => (
                        <li
                            key={student.id}
                            className="flex items-center justify-between"
                        >
                            <span>{student.name}</span>
                            <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                Eliminar
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="ml-3">Sin estudiantes</li>
                )}
            </ol>
            <div className="px-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                {/* Puedes agregar más contenido aquí si es necesario */}
            </div>
        </div>
    );
}

export default StudentList;
