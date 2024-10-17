import React from "react";
import { CheckCircle, Clock, Award, SquareCheckBig } from "lucide-react";

interface ExamReviewCardProps {
    examName: string;
    status: "complete" | "evaluating";
    totalStudents: number;
    evaluatedStudents: number;
    onReview: () => void;
    onViewRankings: () => void;
}

const ExamReviewCard: React.FC<ExamReviewCardProps> = ({
    examName,
    status,
    totalStudents,
    evaluatedStudents,
    onReview,
    onViewRankings,
}) => {
    const progress = (evaluatedStudents / totalStudents) * 100;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {examName}
                </h3>
                <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                        status === "complete"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    }`}
                >
                    {status === "complete" ? (
                        <span className="flex items-center">
                            <CheckCircle size={14} className="mr-1" />
                            Completado
                        </span>
                    ) : (
                        <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            Evaluando
                        </span>
                    )}
                </span>
            </div>

            <div className="mb-4">
                <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-400">
                    <span>Progreso de evaluación</span>
                    <span>
                        {evaluatedStudents} / {totalStudents} estudiantes
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                        className={`h-2.5 rounded-full ${
                            progress == 100
                                ? "bg-green-500"
                                : progress < 50
                                ? "bg-red-500"
                                : "bg-amber-500"
                        }`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={onReview}
                    className="flex items-center justify-center flex-1 px-4 py-2 text-sm text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
                >
                    <SquareCheckBig size={16} className="mr-2" />
                    Revisar Examen
                </button>
                <button
                    onClick={onViewRankings}
                    className="flex items-center justify-center flex-1 px-4 py-2 text-sm text-white transition-colors bg-purple-500 rounded-md hover:bg-purple-600"
                >
                    <Award size={16} className="mr-2" />
                    Ver Ranking
                </button>
            </div>
        </div>
    );
};

export default ExamReviewCard;
