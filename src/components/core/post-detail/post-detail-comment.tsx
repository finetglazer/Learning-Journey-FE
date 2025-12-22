"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export interface Comment {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    createdAt: Date;
    replies?: Comment[];
    replyTo?: string;
}

export const MOCK_COMMENTS: Comment[] = [
    {
        id: "1",
        author: {
            name: "Tran Manh Hung",
            avatar: "https://github.com/shadcn.png",
        },
        content: "I recommend the **slice pattern**. Keeps it modular. Multiple stores get potential dependency issues.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        replies: [
            {
                id: "1-1",
                author: {
                    name: "Nguyen Vinh Hiep",
                    avatar: "https://github.com/shadcn.png",
                },
                content: "Agree. Plus you can type the store as an intersection of slices.",
                createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
                replyTo: "I recommend the...",
            },
        ],
    },
    {
        id: "2",
        author: {
            name: "Sarah Wilson",
            avatar: "https://github.com/shadcn.png",
        },
        content: "Defining actions inside the store is cleaner and easier to test.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        replies: [],
    }
];

// --- Components ---

const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const handleReplySubmit = () => {
        // Here you would typically call an API
        console.log("Submitting reply:", replyContent, "to comment:", comment.id);
        setIsReplying(false);
        setReplyContent("");
    };

    return (
        <div className={`flex gap-3 ${isReply ? "ml-12 mt-4" : "mt-6"}`}>
            {/* Avatar */}
            {!isReply && (
                <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>
            )}

            <div className="flex-1">
                {/* Header: Name, Time, Reply Info */}
                <div className="flex items-center gap-2 text-sm mb-1">
                    {!isReply ? (
                        // Top level comment header style could be implicit or just name
                        // Design image shows name on the right for replies? 
                        // Actually the image shows standard "Name created just now"
                        // Let's stick to standard left-aligned for first implementation unless specified.
                        // Wait, the image has right aligned user info for the reply?? 
                        // "Tran Manh Hung created just now reply to..." is on the RIGHT side of the text? No, it looks like a standard row.
                        // Let's just do standard Header: Name • Time
                        <>
                            <span className="font-medium text-blue-500">{comment.author.name}</span>
                            <span className="text-gray-500 text-xs">
                                created {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                            </span>
                        </>
                    ) : (
                        // Reply header
                        <div className="flex items-center gap-2 w-full justify-between">
                            {/* Styling bit specific to proper threading if needed, but standard is fine */}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="text-gray-700 text-sm leading-relaxed">
                    {comment.content}
                </div>

                {/* Reply Metadata (Author info moved here for replies based on image?) 
                    The image shows:
                    <Content>
                    <Reply Action>    <Avatar> Name created just now reply to "..."
                    
                    This is an interesting layout. Let's try to match it.
                 */}

                <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-3 text-xs font-medium text-blue-500">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="hover:underline cursor-pointer"
                        >
                            Reply
                        </button>
                        {!isReply && (
                            <>
                                <button className="hover:underline cursor-pointer">Edit</button>
                                <button className="text-gray-400 hover:text-red-500 hover:underline cursor-pointer">Delete</button>
                            </>
                        )}
                    </div>

                    {isReply && (
                        <div className="flex items-center gap-2 justify-end text-xs text-gray-500">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={comment.author.avatar} />
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-blue-500">{comment.author.name}</span>
                            <span>created {formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                            {comment.replyTo && (
                                <span className="truncate max-w-[150px]" title={comment.replyTo}>
                                    reply to "{comment.replyTo.substring(0, 20)}..."
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Reply Input */}
                {isReplying && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-1">
                        <Textarea
                            placeholder="Write a reply..."
                            className="text-sm min-h-[80px]"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="ghost" className="cursor-pointer" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>
                            <Button size="sm" className="cursor-pointer" onClick={handleReplySubmit}>Reply</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export function PostDetailComment({ comments = MOCK_COMMENTS }: { comments?: Comment[] }) {
    const [isOpen, setIsOpen] = useState(true);
    const commentCount = comments.reduce((acc, curr) => acc + 1 + (curr.replies?.length || 0), 0);

    return (
        <div>
            {/* Section Header */}
            <div
                className="flex items-center gap-2 cursor-pointer w-fit mb-6 hover:opacity-80 transition-opacity"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="text-gray-500 font-medium text-sm">
                    {/* Assuming dynamic count */}
                    &lt;{commentCount} comments&gt;
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
            </div>

            {/* Comments List */}
            {isOpen && (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id}>
                            <CommentItem comment={comment} />
                            {/* Nested Replies */}
                            {comment.replies?.map((reply) => (
                                <CommentItem key={reply.id} comment={reply} isReply={true} />
                            ))}
                        </div>
                    ))}

                    <div className="pt-4">
                        <button className="text-gray-500 text-sm hover:underline flex items-center gap-1 cursor-pointer">
                            Show all comments
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
