"use client";

import { AwarenessUser } from "@/model/document";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface PresenceAvatarsProps {
    users: AwarenessUser[];
    maxVisible?: number;
}

export function PresenceAvatars({ users, maxVisible = 5 }: PresenceAvatarsProps) {
    const visibleUsers = users.slice(0, maxVisible);
    const remainingCount = users.length - maxVisible;

    if (users.length === 0) return null;
    console.log(users);

    return (
        <TooltipProvider>
            <div className="flex items-center -space-x-2">
                {visibleUsers.map((user) => (
                    <Tooltip key={user.id}>
                        <TooltipTrigger asChild>
                            <div
                                className="relative"
                                style={{
                                    zIndex: visibleUsers.indexOf(user),
                                }}
                            >
                                <Avatar
                                    className="h-8 w-8 border-2 cursor-pointer"
                                    style={{ borderColor: user.color }}
                                >
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback
                                        style={{ backgroundColor: user.color, color: "white" }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Online indicator */}
                                <span
                                    className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                                    style={{ backgroundColor: user.color }}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{user.name}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}

                {remainingCount > 0 && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="relative transition-transform hover:scale-110"
                                style={{ zIndex: maxVisible }} // Ensure it sits on top
                            >
                                <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-900 cursor-pointer">
                                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-bold dark:bg-gray-800 dark:text-gray-300">
                                        +{remainingCount}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="space-y-1">
                                {users.slice(maxVisible).map((user) => (
                                    <p key={user.id}>{user.name}</p>
                                ))}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                )}
            </div>
        </TooltipProvider>
    );
}