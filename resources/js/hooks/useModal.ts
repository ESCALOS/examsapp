import { ReactNode, useState } from "react";

export function useModal() {
    const [showModal, setShowModal] = useState(false);
    const [formContent, setFormContent] = useState<ReactNode>(null);

    // Función para abrir el modal con contenido
    const openModal = (content: ReactNode) => {
        setFormContent(content);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setShowModal(false);
        setFormContent(null);
    };

    return { openModal, closeModal, formContent, showModal };
}
