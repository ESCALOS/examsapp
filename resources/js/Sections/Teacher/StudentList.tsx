import { Student } from "@/types";
import { ChevronRight } from "lucide-react";

type Props = {
    students: Student[];
    onStudentSelect: (student: Student) => void;
};

function StudentList({ students, onStudentSelect }: Props) {
    return (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[60vh] overflow-auto">
            {students.map((student) => (
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
    );
}

export default StudentList;
