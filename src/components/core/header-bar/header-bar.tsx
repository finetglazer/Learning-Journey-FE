"use client";

import { Bell, Menu, Search, Settings } from 'lucide-react';
import React from 'react';

export interface HeaderBarProps {
    onMenuClick?: () => void;
    onNotificationsClick?: () => void;
    onSettingsClick?: () => void;
    avatarUrl?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
    onMenuClick,
    onNotificationsClick,
    onSettingsClick,
    avatarUrl,
}) => {
    return (
        <header className="relative flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-5 shadow-sm">

            {/* Left Section: Menu and Logo */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Toggle menu"
                >
                    <Menu size={22} />
                </button>
                <button className="h-8 w-8 cursor-pointer overflow-hidden" aria-label="View profile">
                    <img
                        // Uses the avatarUrl prop, or a placeholder if not provided
                        src={`iconpng.png`}
                        alt="Home Icon"
                        className="h-full w-full object-cover"
                    />
                </button>
            </div>

            {/* Center Section: Search Bar */}
            {/* This uses absolute positioning to ensure it's perfectly centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-64 sm:w-96 rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm
                                   focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Right Section: Icons and Avatar */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onNotificationsClick}
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    aria-label="View notifications"
                >
                    <Bell size={20} />
                </button>
                <button
                    onClick={onSettingsClick}
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    aria-label="View settings"
                >
                    <Settings size={20} />
                </button>

                {/* Avatar */}
                <button className="h-8 w-8 rounded-full overflow-hidden border border-gray-300" aria-label="View profile">
                    <img
                        // Uses the avatarUrl prop, or a placeholder if not provided
                        src={avatarUrl || `https://placehold.co/32x32/E2E8F0/64748B?text=U`}
                        alt="User Avatar"
                        className="h-full w-full object-cover"
                    />
                </button>
            </div>
        </header>
    );
};