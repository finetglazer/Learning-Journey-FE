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
    keywords?: string[];  // 👈 Add this line
    command: (props: { editor: any; range: any }) => void;
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
                keywords: ["p", "paragraph"],
                icon: <Type className="w-5 h-5" />,
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).setParagraph().run();
                },
            },
            {
                title: "Heading 1",
                keywords: ["h1", "big"],
                icon: <span className="font-bold text-sm">H1</span>,
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setHeading({ level: 1 })  // ✅ CORRECT
                        .run();
                },
            },
            {
                title: "Heading 2",
                keywords: ["h2", "medium"],
                icon: <span className="font-bold text-sm">H2</span>,
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setHeading({ level: 2 })  // ✅ CORRECT
                        .run();
                },
            },
            {
                title: "Heading 3",
                keywords: ["h3", "small"],
                icon: <span className="font-bold text-sm">H3</span>,
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setHeading({ level: 3 })  // ✅ CORRECT
                        .run();
                },
            },
            {
                title: "Bulleted List",
                keywords: ["ul", "list", "bullet"],
                icon: <List className="w-5 h-5" />,
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleBulletList().run();
                },
            },
            {
                title: "Numbered List",
                keywords: ["ol", "ordered", "number"],
                icon: <ListOrdered className="w-5 h-5" />,
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleOrderedList().run();
                },
            },
            {
                title: "Toggle list",
                keywords: ["task", "todo", "check"],
                icon: <ChevronDown className="w-5 h-5" />,
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleTaskList().run();
                },
            },
            {
                title: "Quote",
                keywords: ["blockquote", "cite"],
                icon: <Quote className="w-5 h-5" />,
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleBlockquote().run();
                },
            },
            {
                title: "Divider",
                keywords: ["hr", "line", "separator"],
                icon: <Minus className="w-5 h-5" />,
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).setHorizontalRule().run();
                },
            },
            {
                title: "Callout",
                keywords: ["box", "note", "alert"],
                icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                ),
                // Note: Using blockquote as a fallback for callout since standard Tiptap StarterKit doesn't have a specific Callout node
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleBlockquote().run();
                },
            },
        ],
    },
    {
        title: "Media",
        items: [
            {
                title: "Image",
                keywords: ["img", "photo", "picture"],
                icon: <Image className="w-5 h-5" />,
                command: ({ editor, range }) => {
                    // 1. Delete the slash command text immediately
                    editor.chain().focus().deleteRange(range).run();

                    // 2. Then prompt the user (so the /image text is gone while they type)
                    const url = window.prompt("Enter image URL:");
                    if (url) {
                        editor.chain().focus().setImage({ src: url }).run();
                    }
                },
            },
            {
                title: "Code",
                keywords: ["codeblock", "snippet", "pre"],
                icon: <Code className="w-5 h-5" />,
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
                },
            },
            {
                title: "File",
                keywords: ["upload", "attachment", "doc"],
                icon: <FileText className="w-5 h-5" />,
                command: ({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).run();
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
                keywords: ["grid", "sheet", "rows"],
                icon: <Table className="w-5 h-5" />,
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run();
                },
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

                // ✅ FIXED: Simpler isolation check
                allow: ({ state, range }: { state: any; range: any }) => {
                    const $pos = state.doc.resolve(range.from);
                    const textContent = $pos.parent.textContent;
                    const posInParent = range.from - $pos.start();

                    // Only check character BEFORE the "/"
                    const charBefore = posInParent > 0 ? textContent[posInParent - 1] : "";

                    // Allow if "/" is at start of line or preceded by space
                    return charBefore === "" || charBefore === " ";
                },

                // ✅ PART 2: Smart command execution (unchanged)
                command: ({ editor, range, props }: { editor: any; range: any; props: CommandItem }) => {
                    const { state } = editor;
                    const { from } = range;
                    const $from = state.doc.resolve(from);

                    // Get all text before the "/" on the current line
                    const textBeforeSlash = $from.parent.textContent.substring(0, from - $from.start());
                    const hasContentBefore = textBeforeSlash.trim().length > 0;

                    if (hasContentBefore) {
                        // Case: "Hello /" → Keep "Hello", apply format to new line below

                        // 1. Delete the slash and query text
                        editor.chain().focus().deleteRange(range).run();

                        // 2. Insert a line break (like pressing Enter)
                        editor.chain().focus().insertContent('<p></p>').run();

                        // 3. Apply the format (the command will handle its own formatting)
                        // We pass an empty range since we're on a new empty line
                        const newState = editor.state;
                        const newPos = newState.selection.from;
                        props.command({ editor, range: { from: newPos, to: newPos } });

                    } else {
                        // Case: "/" at start of empty line → Apply format to current line
                        props.command({ editor, range });
                    }
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
                            items: group.items.filter((item) => {
                                const lowerQuery = query.toLowerCase();

                                return (
                                    item.title.toLowerCase().includes(lowerQuery) ||
                                    item.keywords?.some((keyword) =>
                                        keyword.toLowerCase().includes(lowerQuery)
                                    )
                                );
                            }),
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