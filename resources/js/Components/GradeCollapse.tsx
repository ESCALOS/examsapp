import React, { ReactNode } from "react";
import Collapse from "./Collapse";

interface GradeCollapseProps {
    children: ReactNode;
    grade: any;
    onAddButtonClick: (grade: any) => void;
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
