import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Eye, Upload } from "lucide-react";
import { Grade } from "@/types";

interface GradeCollapseProps {
    grade: Grade;
}

const GradeCollapse: React.FC<GradeCollapseProps> = ({ grade }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4 overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
            <div
                className="flex items-center justify-between p-4 bg-white cursor-pointer dark:bg-gray-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-semibold">{grade.name}° grado</h3>
                <div className="flex items-center space-x-2">
                    <button
                        className="p-2 text-white bg-green-500 rounded-full dark:bg-green-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            alert("Añadir sección para " + grade.name);
                        }}
                    >
                        <Plus size={20} />
                    </button>
                    {isOpen ? (
                        <ChevronUp size={24} />
                    ) : (
                        <ChevronDown size={24} />
                    )}
                </div>
            </div>
            {isOpen && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {grade.sections.map((section, index) => (
                            <div
                                key={index}
                                className="p-4 bg-white rounded-lg shadow dark:bg-gray-800"
                            >
                                <h4 className="mb-2 font-semibold">
                                    Sección {section.name}
                                </h4>
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                    Docente: {section.teacher}
                                </p>
                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                                    <button
                                        className="flex items-center justify-center w-full p-2 text-white transition-colors bg-blue-500 rounded-md sm:w-1/2 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                        onClick={() =>
                                            alert(
                                                "Importar alumnos para la sección " +
                                                    section.name
                                            )
                                        }
                                    >
                                        <Upload size={16} className="mr-2" />
                                        Importar
                                    </button>
                                    <button
                                        className="flex items-center justify-center w-full p-2 text-white transition-colors bg-purple-500 rounded-md sm:w-1/2 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
                                        onClick={() =>
                                            alert(
                                                "Ver más detalles de la sección " +
                                                    section.name
                                            )
                                        }
                                    >
                                        <Eye size={16} className="mr-2" />
                                        Ver Más
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeCollapse;
