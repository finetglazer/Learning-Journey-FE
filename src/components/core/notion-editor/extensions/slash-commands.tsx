import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { SuggestionOptions } from "@tiptap/suggestion";
import tippy, { Instance as TippyInstance } from "tippy.js";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code,
    Minus,
    CheckSquare,
    Image,
    Table,
    Type,
    FileText,
    ChevronDown,
} from "lucide-react";

interface CommandItem {
    title: string;
    icon: React.ReactNode;
    command: (editor: any) => void;
}

interface CommandGroup {
    title: string;
    items: CommandItem[];
}

const commandGroups: CommandGroup[] = [
    {
        title: "Basic blocks",
        items: [
            {
                title: "Text",
                icon: <Type className="w-5 h-5" />,
                command: (editor) => editor.chain().focus().setParagraph().run(),
            },
            {
                title: "Heading 1",
                icon: <span className="font-bold text-sm">H1</span>,
                command: (editor) =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run(),
            },
            {
                title: "Heading 2",
                icon: <span className="font-bold text-sm">H2</span>,
                command: (editor) =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run(),
            },
            {
                title: "Heading 3",
                icon: <span className="font-bold text-sm">H3</span>,
                command: (editor) =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run(),
            },
            {
                title: "Bulleted List",
                icon: <List className="w-5 h-5" />,
                command: (editor) => editor.chain().focus().toggleBulletList().run(),
            },
            {
                title: "Numbered List",
                icon: <ListOrdered className="w-5 h-5" />,
                command: (editor) => editor.chain().focus().toggleOrderedList().run(),
            },
            {
                title: "Toggle list",
                icon: <ChevronDown className="w-5 h-5" />,
                command: (editor) => editor.chain().focus().toggleTaskList().run(),
            },
            {
                title: "Quote",
                icon: <Quote className="w-5 h-5" />,
                command: (editor) => editor.chain().focus().toggleBlockquote().run(),
            },
            {
                title: "Divider",
                icon: <Minus className="w-5 h-5" />,
                command: (editor) => editor.chain().focus().setHorizontalRule().run(),
            },
            {
                title: "Callout",
                icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                ),
                command: (editor) => editor.chain().focus().toggleBlockquote().run(),
            },
        ],
    },
    {
        title: "Media",
        items: [
            {
                title: "Image",
                icon: <Image className="w-5 h-5" />,
                command: (editor) => {
                    const url = window.prompt("Enter image URL:");
                    if (url) {
                        editor.chain().focus().setImage({ src: url }).run();
                    }
                },
            },
            {
                title: "Code",
                icon: <Code className="w-5 h-5" />,
                command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
            },
            {
                title: "File",
                icon: <FileText className="w-5 h-5" />,
                command: (editor) => {
                    const url = window.prompt("Enter file URL:");
                    if (url) {
                        editor
                            .chain()
                            .focus()
                            .insertContent(`<a href="${url}">📎 File</a>`)
                            .run();
                    }
                },
            },
        ],
    },
    {
        title: "Database",
        items: [
            {
                title: "Table",
                icon: <Table className="w-5 h-5" />,
                command: (editor) =>
                    editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
            },
        ],
    },
];

interface CommandListProps {
    items: CommandGroup[];
    command: (item: CommandItem) => void;
}

interface CommandListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const CommandList = forwardRef<CommandListRef, CommandListProps>(
    (props, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0);

        const allItems = props.items.flatMap((group) => group.items);

        useEffect(() => {
            setSelectedIndex(0);
        }, [props.items]);

        useImperativeHandle(ref, () => ({
            onKeyDown: ({ event }) => {
                if (event.key === "ArrowUp") {
                    setSelectedIndex(
                        (prev) => (prev - 1 + allItems.length) % allItems.length
                    );
                    return true;
                }

                if (event.key === "ArrowDown") {
                    setSelectedIndex((prev) => (prev + 1) % allItems.length);
                    return true;
                }

                if (event.key === "Enter") {
                    const item = allItems[selectedIndex];
                    if (item) {
                        props.command(item);
                    }
                    return true;
                }

                return false;
            },
        }));

        let currentIndex = 0;

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-80 max-h-96 overflow-y-auto">
                {props.items.map((group, groupIndex) => (
                    <div key={group.title}>
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                            {group.title}
                        </div>
                        {group.items.map((item) => {
                            const itemIndex = currentIndex++;
                            return (
                                <button
                                    key={item.title}
                                    onClick={() => props.command(item)}
                                    className={`flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                        itemIndex === selectedIndex
                                            ? "bg-gray-100 dark:bg-gray-700"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400">
                                        {item.icon}
                                    </div>
                                    <p className="text-sm font-normal text-gray-900 dark:text-gray-100">
                                        {item.title}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    }
);

CommandList.displayName = "CommandList";

export const SlashCommands = Extension.create({
    name: "slashCommands",

    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({
                              editor,
                              range,
                              props,
                          }: {
                    editor: any;
                    range: any;
                    props: CommandItem;
                }) => {
                    props.command(editor);
                    editor.chain().focus().deleteRange(range).run();
                },
            } as Partial<SuggestionOptions>,
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
                items: ({ query }: { query: string }) => {
                    return commandGroups
                        .map((group) => ({
                            ...group,
                            items: group.items.filter((item) =>
                                item.title.toLowerCase().includes(query.toLowerCase())
                            ),
                        }))
                        .filter((group) => group.items.length > 0);
                },
                render: () => {
                    let component: ReactRenderer | null = null;
                    let popup: TippyInstance[] | null = null;

                    return {
                        onStart: (props: any) => {
                            component = new ReactRenderer(CommandList, {
                                props,
                                editor: props.editor,
                            });

                            if (!props.clientRect) return;

                            popup = tippy("body", {
                                getReferenceClientRect: props.clientRect,
                                appendTo: () => document.body,
                                content: component.element,
                                showOnCreate: true,
                                interactive: true,
                                trigger: "manual",
                                placement: "bottom-start",
                            });
                        },

                        onUpdate(props: any) {
                            component?.updateProps(props);

                            if (!props.clientRect) return;

                            popup?.[0]?.setProps({
                                getReferenceClientRect: props.clientRect,
                            });
                        },

                        onKeyDown(props: any) {
                            if (props.event.key === "Escape") {
                                popup?.[0]?.hide();
                                return true;
                            }

                            return (component?.ref as any)?.onKeyDown(props);
                        },

                        onExit() {
                            popup?.[0]?.destroy();
                            component?.destroy();
                        },
                    };
                },
            }),
        ];
    },
});