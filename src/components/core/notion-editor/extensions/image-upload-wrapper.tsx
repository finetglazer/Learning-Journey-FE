"use client";

import React, { useEffect, useState, useId } from "react";
import { ImageUploadDialog } from "./image-upload-dialog";
import { Editor } from "@tiptap/react";

interface ImageUploadWrapperProps {
    editor: Editor | null;
    projectId?: number | string;
    wrapperId?: string;
}

export function ImageUploadWrapper({ editor, projectId, wrapperId }: ImageUploadWrapperProps) {
    const [isOpen, setIsOpen] = useState(false);
    const autoId = useId();
    const effectiveId = wrapperId || autoId;

    useEffect(() => {
        if (!editor) return;

        const handleOpenImageUploadDialog = (event: Event) => {
            const customEvent = event as CustomEvent;
            const eventEditor = customEvent.detail?.editor;

            // Compare using the editor's DOM element which is unique per instance
            if (eventEditor && editor &&
                eventEditor.view?.dom === editor.view?.dom) {
                setIsOpen(true);
            }
        };

        window.addEventListener("openImageUploadDialog", handleOpenImageUploadDialog);
        return () => {
            window.removeEventListener("openImageUploadDialog", handleOpenImageUploadDialog);
        };
    }, [editor, effectiveId]);

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
