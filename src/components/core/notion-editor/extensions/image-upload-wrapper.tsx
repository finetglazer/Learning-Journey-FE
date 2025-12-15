"use client";

import React, { useEffect, useState } from "react";
import { ImageUploadDialog } from "./image-upload-dialog";
import { Editor } from "@tiptap/react";

interface ImageUploadWrapperProps {
    editor: Editor | null;
    projectId?: number | string;
}

export function ImageUploadWrapper({ editor, projectId }: ImageUploadWrapperProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOpenImageUploadDialog = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail && customEvent.detail.editor === editor) {
                setIsOpen(true);
            }
        };

        window.addEventListener("openImageUploadDialog", handleOpenImageUploadDialog);
        return () => {
            window.removeEventListener("openImageUploadDialog", handleOpenImageUploadDialog);
        };
    }, [editor]);

    const handleInsertImage = (url: string) => {
        if (editor && !editor.isDestroyed) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    if (!editor || !projectId) return null;

    return (
        <ImageUploadDialog
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onInsert={handleInsertImage}
            projectId={projectId}
        />
    );
}
