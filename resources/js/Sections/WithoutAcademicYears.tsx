import { router, useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function WithoutAcademicYears() {
    const { processing, post } = useForm({});

    const handleCreate = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, crear año académico",
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar la solicitud POST a la ruta 'academic-year'
                post(route("admin.academic-year.store"), {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Si la solicitud fue exitosa
                        Swal.fire({
                            icon: "success",
                            title: "¡Creado!",
                            text: "¡Año académico creado exitosamente!",
                        });
                    },
                    onError: (page) => {
                        // Si hubo algún error, mostrarlo en SweetAlert
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text:
                                page.message ||
                                "Hubo un problema al crear el año académico.",
                        });
                    },
                    onFinish: () => {
                        router.visit(route("dashboard"));
                    },
                });
            }
        });
    };
    return (
        <div className="max-w-xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
                No hay años académicos
            </h1>
            <p className="mt-4 text-lg text-gray-500">
                Crea un año académico para comenzar a registrar estudiantes y
                profesores.
            </p>
            <div className="mt-6">
                <button
                    onClick={handleCreate}
                    disabled={processing}
                    className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                    Crear año académico
                </button>
            </div>
        </div>
    );
}
