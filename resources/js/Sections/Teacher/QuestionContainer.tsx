type Props = {
    handleAnswerSelection: (
        questionIndex: number,
        selectedAnswer: string
    ) => void;
    answers: (string | null)[];
};

function QuestionContainer({ handleAnswerSelection, answers }: Props) {
    return (
        <div className="max-h-[60vh] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-2 justify-center items-center max-w-2xl">
            {Array.from({ length: answers.length }, (_, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center justify-center py-2 border dark:border-gray-700"
                >
                    <p className="mb-2 font-medium">Pregunta {index + 1}</p>
                    <div className="flex flex-wrap gap-2">
                        {["A", "B", "C", "D", "E"].map((option) => (
                            <button
                                key={option}
                                onClick={() =>
                                    handleAnswerSelection(index, option)
                                }
                                className={`px-3 py-1 text-sm rounded-md ${
                                    option === answers[index]
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                } hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default QuestionContainer;
