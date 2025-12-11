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
} from "lucide-react";

interface CommandItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    command: (editor: any) => void;
}

const commands: CommandItem[] = [
    {
        title: "Heading 1",
        description: "Large section heading",
        icon: <Heading1 className="w-4 h-4" />,
        command: (editor) =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
        title: "Heading 2",
        description: "Medium section heading",
        icon: <Heading2 className="w-4 h-4" />,
        command: (editor) =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        title: "Heading 3",
        description: "Small section heading",
        icon: <Heading3 className="w-4 h-4" />,
        command: (editor) =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
        title: "Bullet List",
        description: "Create a simple bullet list",
        icon: <List className="w-4 h-4" />,
        command: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
        title: "Numbered List",
        description: "Create a numbered list",
        icon: <ListOrdered className="w-4 h-4" />,
        command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
        title: "Task List",
        description: "Create a task list with checkboxes",
        icon: <CheckSquare className="w-4 h-4" />,
        command: (editor) => editor.chain().focus().toggleTaskList().run(),
    },
    {
        title: "Quote",
        description: "Add a blockquote",
        icon: <Quote className="w-4 h-4" />,
        command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
        title: "Code Block",
        description: "Add a code block",
        icon: <Code className="w-4 h-4" />,
        command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
        title: "Divider",
        description: "Add a horizontal divider",
        icon: <Minus className="w-4 h-4" />,
        command: (editor) => editor.chain().focus().setHorizontalRule().run(),
    },
    {
        title: "Table",
        description: "Add a table",
        icon: <Table className="w-4 h-4" />,
        command: (editor) =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run(),
    },
];

interface CommandListProps {
    items: CommandItem[];
    command: (item: CommandItem) => void;
}

interface CommandListRef {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const CommandList = forwardRef<CommandListRef, CommandListProps>(
    (props, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0);

        useEffect(() => {
            setSelectedIndex(0);
        }, [props.items]);

        useImperativeHandle(ref, () => ({
            onKeyDown: ({ event }) => {
                if (event.key === "ArrowUp") {
                    setSelectedIndex(
                        (prev) => (prev - 1 + props.items.length) % props.items.length
                    );
                    return true;
                }

                if (event.key === "ArrowDown") {
                    setSelectedIndex((prev) => (prev + 1) % props.items.length);
                    return true;
                }

                if (event.key === "Enter") {
                    const item = props.items[selectedIndex];
                    if (item) {
                        props.command(item);
                    }
                    return true;
                }

                return false;
            },
        }));

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-72">
                {props.items.length > 0 ? (
                            props.items.map((item, index) => (
                                <button
                                    key={item.title}
                        onClick={() => props.command(item)}
        className={`flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
            index === selectedIndex
                ? "bg-gray-100 dark:bg-gray-700"
                : ""
        }`}
    >
        <div className="flex items-center justify-center w-8 h-8 rounded bg-gray-100 dark:bg-gray-600">
        {item.icon}
        </div>
        <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {item.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
            {item.description}
            </p>
            </div>
            </button>
    ))
    ) : (
            <div className="px-3 py-2 text-sm text-gray-500">No results</div>
    )}
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
                    return commands.filter((item) =>
                        item.title.toLowerCase().includes(query.toLowerCase())
                    );
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