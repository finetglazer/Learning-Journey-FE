import { Node, mergeAttributes } from "@tiptap/core";

// Helper functions (moved from file-node-view.tsx)
const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getIconPath = (ext: string | null, type: string): string => {
    if (type === 'NOTION_DOC') {
        return '/note.png';
    }
    switch (ext?.toLowerCase()) {
        case 'pdf':
            return '/pdf.png';
        case 'xls':
        case 'xlsx':
            return '/xls.png';
        case 'jpg':
        case 'jpeg':
            return '/jpg.png';
        case 'png':
            return '/png.png';
        case 'doc':
        case 'docx':
            return '/doc.png';
        case 'zip':
            return '/zip.png';
        case 'rar':
            return '/rar.png';
        case 'txt':
            return '/txt.png';
        case 'ppt':
        case 'pptx':
            return '/ppt.png';
        default:
            return '/file.svg';
    }
};

// Define the attributes interface
interface FileNodeAttrs {
    name: string;
    extension: string | null;
    sizeBytes: number | null;
    storageReference: string;
    nodeType: string;
}

// Tiptap Extension with DOM-based NodeView
export const FileNode = Node.create({
    name: 'fileNode',
    group: 'block',
    atom: true,
    draggable: false,

    addAttributes() {
        return {
            name: {
                default: '',
            },
            extension: {
                default: null,
            },
            sizeBytes: {
                default: null,
            },
            storageReference: {
                default: '',
            },
            nodeType: {
                default: 'STATIC_FILE',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="file-node"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'file-node' })];
    },

    addNodeView() {
        return ({ node }) => {
            const dom = document.createElement('div');
            dom.classList.add('file-node-wrapper');

            const { name, extension, sizeBytes, storageReference, nodeType } = node.attrs as FileNodeAttrs;

            const content = document.createElement('div');
            // Replicating classes from React component
            // base classes
            let classes = "flex items-center gap-3 px-4 py-3 my-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors";

            // conditional classes
            if (storageReference) {
                classes += " cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700";
                content.onclick = () => {
                    window.open(storageReference, '_blank');
                };
            }
            content.className = classes;
            content.contentEditable = "false"; // Essential for atom nodes to not focus inside

            // Icon
            const icon = document.createElement('img');
            icon.src = getIconPath(extension, nodeType);
            icon.alt = `${extension || 'file'} icon`;
            icon.className = "w-8 h-8";
            content.appendChild(icon);

            // Name container
            const infoDiv = document.createElement('div');
            infoDiv.className = "flex-1 min-w-0";

            const nameP = document.createElement('p');
            nameP.className = "font-medium text-gray-900 dark:text-gray-100 truncate";
            nameP.textContent = `${name}${extension ? `.${extension}` : ''}`;
            infoDiv.appendChild(nameP);
            content.appendChild(infoDiv);

            // Size
            if (sizeBytes) {
                const sizeSpan = document.createElement('span');
                sizeSpan.className = "text-sm text-gray-500 dark:text-gray-400";
                sizeSpan.textContent = formatFileSize(sizeBytes);
                content.appendChild(sizeSpan);
            }

            dom.appendChild(content);

            return {
                dom,
                // Force re-render on updates for simplicity and safety
                update: (updatedNode) => {
                    return updatedNode.type.name === 'fileNode' &&
                        updatedNode.attrs.storageReference === storageReference &&
                        updatedNode.attrs.name === name &&
                        updatedNode.attrs.extension === extension;
                }
            };
        };
    },

    addCommands() {
        return {
            setFileNode: (attributes) => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: attributes,
                });
            },
        };
    },
});

// TypeScript module augmentation for the custom command
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fileNode: {
            setFileNode: (attributes: {
                name: string;
                extension: string | null;
                sizeBytes: number | null;
                storageReference: string;
                nodeType: string;
            }) => ReturnType;
        };
    }
}
