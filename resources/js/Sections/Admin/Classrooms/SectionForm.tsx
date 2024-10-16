import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { AcademicYear, Grade, Teacher } from "@/types";
import { availableSections, filterUnassignedTeachers } from "@/utils";
import { Select } from "@headlessui/react";
import { useForm, usePage } from "@inertiajs/react";
import React from "react";
import Swal from "sweetalert2";

type Props = {
    sectionId?: number;
    grade: Grade;
    academicYear: AcademicYear;
    onCloseModal: () => void;
    assignedTeachers: Teacher[];
    sectionName?: string;
    userId?: number;
};

function SectionForm({
    sectionId,
    grade,
    academicYear,
    sectionName,
    userId,
    onCloseModal,
    assignedTeachers,
}: Props) {
    const { activeTeachers } = usePage().props;
    const sections = availableSections(grade.sections, sectionName);
    const teachers = filterUnassignedTeachers(
        activeTeachers,
        assignedTeachers,
        userId
    );
    if (teachers.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "No hay profesores disponibles para este grado",
        });
        return;
    }

    if (sections.length === 0) {
        Swal.fire({
            icon: "warning",
            title: "Advertencia",
            text: "No hay secciones disponibles para este grado",
        });
        onCloseModal();
        return;
    }
    const { data, setData, processing, post, errors, reset } = useForm({
        id: sectionId,
        userId: userId || teachers[0].id,
        section: sectionName || sections[0],
        academicYearId: academicYear.id,
        grade: grade.name,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Enviar la solicitud POST a la ruta 'classrooms.add-section'
        const uri =
            sectionId === undefined
                ? route("admin.classrooms.add-section")
                : route("admin.classrooms.update-section");
        post(uri, {
            preserveScroll: true,
            onSuccess: () => {
                // Si la solicitud fue exitosa
                Swal.fire({
                    icon: "success",
                    title:
                        sectionId === undefined ? "¡Creado!" : "¡Actualizado!",
                    text:
                        sectionId === undefined
                            ? "Se ha añadido la sección correctamente"
                            : "Se ha actualizado la sección correctamente",
                });

                onCloseModal();
            },
            onError: (page) => {
                // Si hubo algún error, mostrarlo en SweetAlert
                Swal.fire({
                    icon: "warning",
                    title: "Advertencia",
                    text:
                        sectionId === undefined
                            ? "Hubo un problema al crear la sección."
                            : "Hubo un problema al actualizar la sección.",
                });

                reset("section", "userId");
            },
        });
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <InputLabel htmlFor="teacher" value="Profesor" />
                <Select
                    id="teacher"
                    name="teacher"
                    value={data.userId}
                    onChange={(e) =>
                        setData("userId", parseInt(e.target.value))
                    }
                    className="block w-full mt-1 rounded-md"
                >
                    {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                        </option>
                    ))}
                </Select>
                <InputError message={errors.userId} className="mt-2" />
            </div>
            <div>
                <InputLabel htmlFor="section" value="Sección" />
                <Select
                    id="section"
                    name="section"
                    value={data.section}
                    onChange={(e) => setData("section", e.target.value)}
                    className="block w-full mt-1 rounded-md"
                >
                    {sections.map((section) => (
                        <option key={section} value={section}>
                            {section}
                        </option>
                    ))}
                </Select>
                <InputError message={errors.section} className="mt-2" />
            </div>
            <div className="flex items-center justify-end mt-4">
                <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                    disabled={processing}
                >
                    {sectionId === undefined
                        ? "Añadir sección"
                        : "Actualizar sección"}
                </button>
            </div>
        </form>
    );
}

export default SectionForm;
