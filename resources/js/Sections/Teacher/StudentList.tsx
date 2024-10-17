import { Student } from "@/types";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import Swal from "sweetalert2";

type Props = {
    evaluatedStudents: Student[];
    notEvaluatedStudents: Student[];
    showEvaluated: boolean;
    onStudentSelect: (student: Student) => void;
};

function StudentList({
    evaluatedStudents,
    notEvaluatedStudents,
    showEvaluated,
    onStudentSelect,
}: Props) {
    // Lista de estudiantes que se mostrará
    const displayedStudents = showEvaluated
        ? evaluatedStudents
        : notEvaluatedStudents;

    return (
        <div>
            {/* Lista de estudiantes */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] overflow-auto">
                {displayedStudents.map((student) => (
                    <li key={student.id} className="py-3">
                        <button
                            onClick={() => onStudentSelect(student)}
                            className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <span>{student.name}</span>
                            <ChevronRight size={20} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default StudentList;
