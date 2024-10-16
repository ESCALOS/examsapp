import React, { Children, ReactNode } from "react";
import { Eye, PencilIcon, Trash2Icon, Upload } from "lucide-react";
import { AcademicYear, Grade, Section, Student, Teacher } from "@/types";
import Collapse from "./Collapse";
import Swal from "sweetalert2";
import SectionForm from "@/Sections/Admin/Classrooms/SectionForm";
import { router, useForm } from "@inertiajs/react";
import ImportStudentForm from "@/Sections/Admin/Classrooms/ImportStudentForm";
import SectionCard from "./SectionCard";

interface GradeCollapseProps {
    children: ReactNode;
    grade: Grade;
    currentYear: AcademicYear;
    teachers: Teacher[];
    setFormContent: React.Dispatch<React.SetStateAction<ReactNode>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    onAddButtonClick: (grade: Grade) => void;
    showAddButton: boolean;
}

const GradeCollapse: React.FC<GradeCollapseProps> = ({
    children,
    grade,
    showAddButton,
    onAddButtonClick,
}) => {
    const handleAddButton = () => {
        onAddButtonClick(grade);
    };

    return (
        <Collapse
            title={grade.name + "° grado"}
            onAddButtonClick={handleAddButton}
            showAddButton={showAddButton}
        >
            <div className="p-4 bg-gray-50 dark:bg-gray-700">{children}</div>
        </Collapse>
    );
};

export default GradeCollapse;
