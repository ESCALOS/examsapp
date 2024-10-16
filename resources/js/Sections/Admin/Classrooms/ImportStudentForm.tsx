import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

type Props = {
    academicYearId: number;
    grade: string;
    section: string;
    onCloseModal: () => void;
};

function ImportStudentForm({
    academicYearId,
    grade,
    section,
    onCloseModal,
}: Props) {
    const { setData, post, processing } = useForm({
        file: undefined as File | undefined,
        academicYearId: academicYearId,
        grade: grade,
        section: section,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData("file", e.target.files[0]); // Solo establece el archivo si hay un archivo seleccionado
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("admin.classrooms.import-students"), {
            onProgress: () => {
                // Si la solicitud está en curso
                Swal.fire({
                    icon: "info",
                    title: "Importando...",
                    text: "Estudiantes se están importando",
                });
            },
            onSuccess: () => {
                // Si la solicitud fue exitosa
                Swal.fire({
                    icon: "success",
                    title: "¡Importado!",
                    text: "Estudiantes importados exitosamente",
                });
                onCloseModal();
            },
            onError: (page) => {
                // Si hubo algún error, mostrarlo en SweetAlert
                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text:
                        page.message ||
                        "Hubo un problema al importar los estudiantes.",
                });
            },
        });
    };
    return (
        <form onSubmit={handleSubmit}>
            <InputLabel
                htmlFor="file"
                value="Ingrese el excel con los estudiantes"
            />
            <TextInput
                type="file"
                className="w-full"
                onChange={handleFileChange}
            />
            <div className="flex items-center justify-end mt-4">
                <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                    disabled={processing}
                >
                    Importar estudiantes
                </button>
            </div>
        </form>
    );
}

export default ImportStudentForm;
