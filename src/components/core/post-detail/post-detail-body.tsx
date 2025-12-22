"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { ArrowUp, ChevronDown, ChevronUp, Flag } from "lucide-react";
import { useContext } from "react";
import { Comment, MOCK_COMMENTS, PostDetailComment } from "./post-detail-comment";
import { PostDetailContext, PostDetailContextProps } from "./post-detail-context";
import { PostDetailQuestion } from "./post-detail-question";

interface Answer {
    id: string;
    author: {
        name: string;
        avatar: string;
        email?: string; // Optional for user card
    };
    content: string;
    createdAt: Date;
    votes: number;
    comments: Comment[];
    isAddedToProject?: boolean;
}

const MOCK_ANSWERS: Answer[] = [
    {
        id: "1",
        author: {
            name: "Michael Chen",
            avatar: "https://github.com/shadcn.png",
            email: "michael.chen@example.com"
        },
        content: "I recommend the **Slices Pattern**. It splits the store (authSlice, cartSlice) while keeping one instance.\n\nFor async, use **TanStack Query** for server state (caching, retries) and Zustand for UI state (theme, sidebar).",
        createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
        votes: 42,
        comments: [
            {
                id: "1-1",
                author: {
                    name: "Sarah Wilson",
                    avatar: "https://github.com/shadcn.png",
                },
                content: "This is exactly what I ended up doing. Separation of Server State vs Client State is key.",
                createdAt: new Date(Date.now() - 1000 * 60 * 5),
                replies: [],
            },
            {
                id: "1-2",
                author: {
                    name: "Nguyen Vinh Hiep",
                    avatar: "https://github.com/shadcn.png",
                },
                content: "Do you have a code snippet for the Slices pattern with Typescript?",
                createdAt: new Date(Date.now() - 1000 * 60 * 2),
                replies: [],
                replyTo: "This is exactly..."
            }
        ]
    }
];

export const PostDetailBody = () => {
    const { postDetailData } = useContext<PostDetailContextProps>(PostDetailContext);

    if (!postDetailData) return null;

    return (
        <div className="flex gap-10 mt-6">
            {/* Left Column: Vote Counter */}
            <div className="flex flex-col items-center gap-1 mt-5">
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 cursor-pointer">
                    <ChevronUp className="h-8 w-8 text-gray-500" />
                </Button>

                <span className="text-2xl font-semibold text-gray-700">
                    {postDetailData.votes}
                </span>

                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 cursor-pointer">
                    <ChevronDown className="h-8 w-8 text-gray-500" />
                </Button>
            </div>

            {/* Right Column: Question Content + Comments */}
            <div className="flex-1 min-w-0">
                <PostDetailQuestion />

                {/* Actions Row */}
                <div className="flex items-center gap-4 mt-2 mb-6">
                    <button className="text-gray-500 text-sm font-medium hover:text-blue-500 cursor-pointer">
                        Comment
                    </button>
                    <button className="text-gray-500 text-sm font-medium hover:text-blue-500 cursor-pointer">
                        Edit
                    </button>
                    <button className="text-gray-500 text-sm font-medium hover:text-red-500 cursor-pointer">
                        Delete
                    </button>
                </div>

                {/* Comment Input */}
                <div className="mb-6">
                    <Textarea
                        placeholder="Only text type allowed for comments"
                        className="resize-none min-h-[50px] border-gray-300 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
                    />
                </div>

                {/* Question Comments Section */}
                <PostDetailComment comments={MOCK_COMMENTS} />

                {/* Answers Header Separator */}
                <div className="flex items-center justify-between mt-10 border-b pb-4 mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">
                        {postDetailData.answers} answers
                    </h3>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            className="bg-blue-50 text-blue-600 hover:bg-blue-100 h-9 px-4 font-medium text-sm cursor-pointer"
                        >
                            <Flag className="mr-2 h-4 w-4" /> Newest
                        </Button>
                        <Button
                            variant="ghost"
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 h-9 px-4 font-medium text-sm cursor-pointer"
                        >
                            <ArrowUp className="mr-2 h-5 w-5" /> Most helpful
                        </Button>
                    </div>
                </div>

                {/* Answers List */}
                <div className="space-y-10">
                    {MOCK_ANSWERS.map((answer) => (
                        <div key={answer.id} className="flex gap-6">
                            {/* Answer Vote Counter */}
                            <div className="flex flex-col items-center gap-1">
                                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 cursor-pointer">
                                    <ChevronUp className="h-8 w-8 text-gray-500" />
                                </Button>

                                <span className="text-xl font-semibold text-gray-700">
                                    {answer.votes}
                                </span>

                                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 cursor-pointer">
                                    <ChevronDown className="h-8 w-8 text-gray-500" />
                                </Button>

                                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 cursor-pointer mt-2">
                                    <div className="h-6 w-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                                        <span className="text-emerald-500 text-xs font-bold">✓</span>
                                    </div>
                                </Button>
                            </div>

                            {/* Answer Content */}
                            <div className="flex-1 min-w-0">
                                <div className="text-gray-800 leading-relaxed mb-4">
                                    {answer.content}
                                </div>

                                {/* Answer Metadata / Actions */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <button className="text-blue-500 text-sm hover:underline cursor-pointer">
                                            Comment
                                        </button>
                                        <button className="text-blue-500 text-sm hover:underline cursor-pointer">
                                            Edit
                                        </button>
                                        <button className="text-gray-400 text-sm hover:text-red-500 hover:underline cursor-pointer">
                                            Delete
                                        </button>
                                    </div>

                                    {/* Author Card (Right aligned) */}
                                    <div className="flex items-center gap-3 bg-blue-50/50 p-2 rounded-lg border border-blue-100 min-w-[200px]">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={answer.author.avatar} />
                                            <AvatarFallback>{answer.author.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-900">{answer.author.name}</span>
                                            {answer.author.email && (
                                                <span className="text-xs text-gray-500">{answer.author.email}</span>
                                            )}
                                            <span className="text-xs text-gray-400 mt-1">
                                                answered {formatDistanceToNow(answer.createdAt, { addSuffix: true })}
                                            </span>
                                        </div>
                                        <Button className="ml-auto bg-emerald-300 hover:bg-emerald-400 text-emerald-900 text-xs h-7 px-2 cursor-pointer rounded shadow-sm">
                                            Invite to your project
                                        </Button>
                                    </div>
                                </div>

                                {/* Answer Comments */}
                                <PostDetailComment comments={answer.comments} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
