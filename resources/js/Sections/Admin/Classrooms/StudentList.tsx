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

    const handleDeleteStudent = (student: { id: number; name: string }) => {
        Swal.fire({
            icon: "warning",
            title: "¿Eliminar al estudiante?",
            text: student.name,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar estudiante",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    title: "Eliminando...",
                    showConfirmButton: false,
                });
                router.visit(route("admin.classrooms.delete-student"), {
                    method: "delete",
                    data: { id: student.id },
                    only: ["assignedTeachers"],
                    preserveState: true,
                    onSuccess: () => {
                        // Si la solicitud fue exitosa
                        Swal.fire({
                            icon: "success",
                            title: "¡Eliminado!",
                            text: "El estudiante se ha eliminado correctamente",
                        });
                        deleteStudent(student.id);
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
                                onClick={() => handleDeleteStudent(student)}
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
