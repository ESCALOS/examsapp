import Modal from "@/Components/Modal";
import { useModal } from "@/hooks/useModal";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import TeacherForm from "@/Sections/Admin/Teachers/TeacherForm";
import { User } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Edit2, Plus, XCircle, XIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import Swal from "sweetalert2";

type Props = {
    teachers: User[];
};

function Teacher({ teachers }: Props) {
    const { showModal, openModal, closeModal, formContent } = useModal();

    const handleAddTeacher = () => {
        openModal(<TeacherForm closeModal={closeModal} />);
    };

    const handleEditTeacher = (teacher: User) => {
        openModal(<TeacherForm closeModal={closeModal} teacher={teacher} />);
    };

    const handleToggleTeacherStatus = (id: number, isActive: boolean) => {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: isActive
                ? "¿Seguro que quieres inhabilitar el docente?"
                : "¿Seguro que quieres habilitar el docente?",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: isActive ? "Inhabilitar" : "Habilitar",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    title: isActive ? "Inhabilitando..." : "Habilitando...",
                    showConfirmButton: false,
                });
                router.visit(route("admin.teachers.toggle-status"), {
                    method: "delete",
                    data: { id: id, is_active: isActive },
                    only: ["teachers", "activeTeachers"],
                    onSuccess: () => {
                        // Si la solicitud fue exitosa
                        Swal.fire({
                            icon: "success",
                            title: isActive ? "Inhabilitado" : "Habilitado",
                            text: isActive
                                ? "El docente se ha inhabilitado"
                                : "El docente se ha habilitado",
                        });
                    },
                    onError: (page) => {
                        // Si hubo algún error, mostrarlo en SweetAlert
                        Swal.fire({
                            icon: "warning",
                            title: "Advertencia",
                            text:
                                page.message ||
                                "Hubo un problema al inhabilitar el docente.",
                        });
                    },
                });
            }
        });
    };

    return (
        <Authenticated>
            <Head title="Docentes" />

            <div className="px-4 py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h1 className="mb-6 text-2xl font-bold text-center text-blue-800 sm:text-3xl sm:mb-8 dark:text-blue-300">
                        Gestión de Docentes
                    </h1>
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={handleAddTeacher}
                            className="flex items-center px-4 py-2 text-white transition-colors bg-green-500 rounded-md hover:bg-green-600"
                        >
                            <Plus size={20} className="mr-2" />
                            Agregar Docente
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {teachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${
                                    !teacher.is_active ? "opacity-60" : ""
                                }`}
                            >
                                <h3 className="mb-2 font-semibold">
                                    {teacher.name}
                                </h3>
                                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                    DNI: {teacher.dni}
                                </p>
                                <div className="flex justify-between">
                                    <button
                                        onClick={() =>
                                            handleEditTeacher(teacher)
                                        }
                                        className="flex items-center px-3 py-1 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                                    >
                                        <Edit2 size={16} className="mr-1" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleToggleTeacherStatus(
                                                teacher.id,
                                                teacher.is_active
                                            )
                                        }
                                        className={`flex items-center px-3 py-1 rounded-md transition-colors text-sm ${
                                            teacher.is_active
                                                ? "bg-red-500 text-white hover:bg-red-600"
                                                : "bg-yellow-500 text-white hover:bg-yellow-600"
                                        }`}
                                    >
                                        <XCircle size={16} className="mr-1" />
                                        {teacher.is_active
                                            ? "Inhabilitar"
                                            : "Habilitar"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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
}

export default Teacher;
