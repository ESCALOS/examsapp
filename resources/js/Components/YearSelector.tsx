import { LucideChevronLeft } from "@/Icons/LucideChevronLeft";
import { LucideChevronRight } from "@/Icons/LucideChevronRight";
import { AcademicYear } from "@/types";
import { FC } from "react";

type Props = {
    years: AcademicYear[];
    selectedYear: AcademicYear;
    setSelectedYear: (academicYear: AcademicYear) => void;
};

const YearSelector: FC<Props> = ({ years, selectedYear, setSelectedYear }) => {
    const currentIndex = years.findIndex((year) => year.id === selectedYear.id);

    const handlePreviousYear = () => {
        if (currentIndex > 0) {
            setSelectedYear(years[currentIndex - 1]);
        }
    };

    const handleNextYear = () => {
        if (currentIndex < years.length - 1) {
            setSelectedYear(years[currentIndex + 1]);
        }
    };

    return (
        <div className="flex items-center justify-center space-x-4">
            <button
                onClick={handlePreviousYear}
                disabled={currentIndex === 0}
                className="p-2 text-white bg-blue-500 rounded-full disabled:opacity-50 dark:bg-blue-700"
            >
                <LucideChevronLeft width={24} height={24} />
            </button>
            <h2 className="text-2xl font-semibold">
                Año Lectivo: {selectedYear.year}
            </h2>
            <button
                onClick={handleNextYear}
                disabled={currentIndex === years.length - 1}
                className="p-2 text-white bg-blue-500 rounded-full disabled:opacity-50 dark:bg-blue-700"
            >
                <LucideChevronRight width={24} height={24} />
            </button>
        </div>
    );
};

export default YearSelector;
