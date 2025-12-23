import { Node } from "@tiptap/core";

// Helper to get icon path
const getIconPath = (ext: string | null, type: string): string => {
    if (type === 'NOTION_DOC') return '/note.png';
    const e = ext?.toLowerCase();
    if (e === 'pdf') return '/pdf.png';
    if (['xls', 'xlsx'].includes(e || '')) return '/xls.png';
    if (['jpg', 'jpeg', 'png'].includes(e || '')) return '/jpg.png';
    if (['doc', 'docx'].includes(e || '')) return '/doc.png';
    if (['zip', 'rar'].includes(e || '')) return '/zip.png';
    if (['ppt', 'pptx'].includes(e || '')) return '/ppt.png';
    if (e === 'txt') return '/txt.png';
    return '/file.svg';
};

// Helper to format size
const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const FileNode = Node.create({
    name: 'fileNode',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            name: { default: 'Untitled' },
            extension: { default: null },
            sizeBytes: { default: null },
            storageReference: { default: '' },
            nodeType: { default: 'STATIC_FILE' },
        };
    },

    parseHTML() {
        return [{ tag: 'div.file-node-wrapper' }];
    },

    renderHTML({ node }) {
        const { name, extension, sizeBytes, storageReference, nodeType } = node.attrs;
        const iconPath = getIconPath(extension, nodeType);
        const sizeText = formatFileSize(sizeBytes);
        const fileName = `${name}${extension ? '.' + extension : ''}`;
        const hasLink = Boolean(storageReference);

        return [
            'div',
            {
                class: 'file-node-wrapper',
                contenteditable: 'false'
            },
            [
                'div',
                {
                    class: `file-node-card ${hasLink ? 'file-node-clickable' : ''}`,
                    'data-storage-reference': storageReference,
                    'data-file-name': fileName,
                    'data-file-extension': extension || '',
                    'data-file-size': String(sizeBytes || ''),
                    'data-node-type': nodeType,
                },
                [
                    'img',
                    {
                        src: iconPath,
                        class: 'file-node-icon',
                        alt: extension || 'file',
                    }
                ],
                [
                    'div',
                    { class: 'file-node-info' },
                    [
                        'span',
                        { class: 'file-node-name' },
                        fileName
                    ],
                    ...(sizeText ? [
                        [
                            'span',
                            { class: 'file-node-size' },
                            sizeText
                        ]
                    ] : [])
                ]
            ]
        ];
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

// Types
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