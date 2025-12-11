import { Mark, mergeAttributes } from "@tiptap/core";

export interface CommentMarkOptions {
    HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        commentMark: {
            setComment: (threadId: string) => ReturnType;
            unsetComment: (threadId: string) => ReturnType;
        };
    }
}

export const CommentMark = Mark.create<CommentMarkOptions>({
    name: "comment",

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            threadId: {
                default: null,
                parseHTML: (element) => element.getAttribute("data-thread-id"),
                renderHTML: (attributes) => {
                    if (!attributes.threadId) return {};
                    return { "data-thread-id": attributes.threadId };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "span[data-thread-id]",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "span",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: "comment-highlight",
                style:
                    "background-color: rgba(255, 212, 0, 0.3); border-bottom: 2px solid #ffd400; cursor: pointer;",
            }),
            0,
        ];
    },

    addCommands() {
        return {
            setComment:
                (threadId: string) =>
                    ({ commands }) => {
                        return commands.setMark(this.name, { threadId });
                    },
            unsetComment:
                (threadId: string) =>
                    ({ tr, state, dispatch }) => {
                        const { doc, selection } = state;
                        const { from, to } = selection;

                        // Find and remove all comment marks with this threadId
                        doc.descendants((node, pos) => {
                            if (node.isText) {
                                node.marks.forEach((mark) => {
                                    if (
                                        mark.type.name === this.name &&
                                        mark.attrs.threadId === threadId
                                    ) {
                                        if (dispatch) {
                                            tr.removeMark(
                                                pos,
                                                pos + node.nodeSize,
                                                state.schema.marks.comment
                                            );
                                        }
                                    }
                                });
                            }
                        });

                        if (dispatch) {
                            dispatch(tr);
                        }

                        return true;
                    },
        };
    },
});