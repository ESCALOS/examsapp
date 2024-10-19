import { Student } from "@/types";
import { X } from "lucide-react";

type RankingItem = {
    student: Student;
    correct: number;
    incorrect: number;
    rank: number;
};

type Props = {
    rankingList: RankingItem[];
    closeModal: () => void;
};

function RankedList({ rankingList, closeModal }: Props) {
    return (
        <div className="w-full max-w-3xl p-6 overflow-y-auto bg-white rounded-lg dark:bg-gray-800 dark:text-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Clasificación de estudiantes
                </h2>

                <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="flex flex-col gap-4 max-h-[60vh] overflow-x-auto">
                {rankingList.map((item, index) => (
                    <div
                        key={index}
                        className={`relative shadow-lg rounded-lg p-6 flex items-center space-x-4 border-l-8
                            ${
                                item.rank === 1
                                    ? "bg-yellow-100 border-yellow-500 dark:bg-yellow-700"
                                    : ""
                            }
                            ${
                                item.rank === 2
                                    ? "bg-gray-100 border-gray-500 dark:bg-gray-700"
                                    : ""
                            }
                            ${
                                item.rank > 2
                                    ? "bg-white dark:bg-gray-800 border-indigo-500 dark:border-indigo-400"
                                    : ""
                            }`}
                    >
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                                {item.student.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-bold text-green-600 dark:text-green-400">
                                    {item.correct}
                                </span>{" "}
                                correctas,{" "}
                                <span className="font-bold text-red-600 dark:text-red-400">
                                    {item.incorrect}
                                </span>{" "}
                                incorrectas
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RankedList;
