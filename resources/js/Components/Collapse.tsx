import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { ReactNode, useState } from "react";

type Props = {
    title: string;
    children: ReactNode;
    showAddButton?: boolean;
    onAddButtonClick: () => void;
};

function Collapse({
    title,
    children,
    showAddButton = true,
    onAddButtonClick,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const handleAddButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onAddButtonClick();
    };
    return (
        <div className="mb-4 overflow-hidden border border-gray-200 rounded-lg dark:border-gray-700">
            <div
                className="flex items-center justify-between p-4 bg-white cursor-pointer dark:bg-gray-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-semibold">{title}</h3>
                <div className="flex items-center space-x-2">
                    {showAddButton && (
                        <button
                            className="p-2 text-white bg-green-500 rounded-full dark:bg-green-600"
                            onClick={handleAddButton}
                        >
                            <Plus size={20} />
                        </button>
                    )}
                    {isOpen ? (
                        <ChevronUp size={24} />
                    ) : (
                        <ChevronDown size={24} />
                    )}
                </div>
            </div>
            {isOpen && children}
        </div>
    );
}

export default Collapse;
