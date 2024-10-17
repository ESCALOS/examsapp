type Props = {
    answersSummary: {
        correct: number;
        incorrect: number;
        notAnswered: number;
    };
};

export default function AnswerSummary({ answersSummary }: Props) {
    return (
        <div className="my-4">
            {/* Contenedor del resumen */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                <div className="text-center">
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                        {answersSummary.correct}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-semibold text-red-600 dark:text-red-400">
                        {answersSummary.incorrect}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-400">
                        {answersSummary.notAnswered}
                    </p>
                </div>
            </div>
        </div>
    );
}
