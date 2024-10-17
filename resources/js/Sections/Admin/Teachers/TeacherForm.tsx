import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { User } from "@/types";
import { useForm } from "@inertiajs/react";
import React from "react";
import Swal from "sweetalert2";

type Props = {
    teacher?: User;
    closeModal: () => void;
};

function TeacherForm({ teacher, closeModal }: Props) {
    const { data, setData, post, processing, errors, isDirty } = useForm({
        id: teacher?.id,
        dni: teacher?.dni || "",
        name: teacher?.name || "",
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Enviar la solicitud POST a la ruta 'teachers.add-teacher'
        const uri =
            teacher === undefined
                ? route("admin.teachers.add-teacher")
                : route("admin.teachers.update-teacher");
        post(uri, {
            preserveScroll: true,
            only: ["teachers", "activeTeachers"],
            onProgress: () => {
                // Si la solicitud está en curso
                Swal.fire({
                    icon: "info",
                    title: "Creando...",
                    text: "El docente se está creando",
                });
            },
            onSuccess: () => {
                // Si la solicitud fue exitosa
                Swal.fire({
                    icon: "success",
                    title: "¡Creado!",
                    text: "El docente se creó exitosamente",
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="mb-4 text-xl font-semibold text-center text-gray-700 sm:text-2xl dark:text-gray-100">
                {teacher === undefined ? "Nuevo docente" : "Editar docente"}
            </h2>
            {isDirty && (
                <div className="text-amber-500">* Hay cambios sin guardar</div>
            )}
            <div>
                <InputLabel htmlFor="dni" value="DNI del docente" />
                <input
                    id="dni"
                    name="dni"
                    type="text"
                    value={data.dni}
                    onChange={(e) => setData("dni", e.target.value)}
                    placeholder="DNI del docente"
                    className="flex-grow w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                    autoComplete="dni"
                />
                <InputError message={errors.dni} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="name" value="Nombre del docente" />
                <input
                    id="name"
                    type="text"
                    value={data.name}
                    name="name"
                    onChange={(e) => setData("name", e.target.value)}
                    placeholder="Nombre del docente"
                    className="flex-grow w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                    autoComplete="name"
                />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                    disabled={processing}
                >
                    {teacher === undefined
                        ? "Agregar docente"
                        : "Actualizar docente"}
                </button>
            </div>
        </form>
    );
}

export default TeacherForm;
