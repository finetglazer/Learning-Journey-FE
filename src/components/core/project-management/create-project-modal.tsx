import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';

// const Input = (props) => (
//     <input
//         {...props}
//         className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//     />
// );

// const Label = ({ children, ...props }) => (
//     <label
//         {...props}
//         className="block text-sm font-medium text-gray-800 mb-1.5"
//     >
//         {children}
//     </label>
// );

// --- Button Component ---
// A reusable Button component styled like the image
// const Button = ({ children, className, ...props }) => (
//     <button
//         {...props}
//         className={`w-full px-6 py-3 text-base font-bold text-gray-800 bg-cyan-400 rounded-lg shadow-lg transition-all
//             ${className}
//             hover:bg-cyan-500
//             focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
//             active:bg-cyan-600
//             shadow-cyan-400/50
//         `}
//     >
//         {children}
//     </button>
// );

export const CreateProjectModal = () => {
    // State to manage the project name input
    const [projectName, setProjectName] = useState('');

    const mockUser = {
        name: 'Trần Mạnh Hùng',
        email: 'tranhung10122003@gmail.com',
        avatarUrl: 'https://placehold.co/40x40/E0E0E0/707070?text=TM',
        role: 'Owner',
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Creating project:', projectName);
        // Add your project creation logic here
    };

    return (
        <div className="w-full absolute top-[25%] left-[40%] max-w-lg p-8 bg-white rounded-2xl shadow-2xl items-center" >
            <form onSubmit={handleSubmit}>

                {/* --- Header --- */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Create a shared project
                </h2>

                {/* --- Project Name Input --- */}
                <div className="mb-6">
                    <Label htmlFor="projectName" className="mb-3">
                        Name project <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="projectName"
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        required
                    />
                </div>

                {/* --- Members Section --- */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Members
                    </h3>

                    {/* --- Member List Item --- */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img
                                src={mockUser.avatarUrl}
                                alt={mockUser.name}
                                className="w-10 h-10 rounded-full object-cover"
                                // Handle image loading error
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/40x40/E0E0E0/707070?text=TM';
                                }}
                            />
                            <div>
                                <div className="font-semibold text-sm text-gray-900">
                                    {mockUser.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {mockUser.email}
                                </div>
                            </div>
                        </div>

                        <span className="text-sm font-medium text-gray-500">
                            {mockUser.role}
                        </span>
                    </div>
                </div>

                {/* --- Description Text --- */}
                <p className="text-sm text-gray-600 leading-relaxed mb-8">
                    Creating a shared space for a team whose space is in form of Kanban board.
                    Kanban (the Japanese word for "visual signal") is all about helping teams visualize their work, limit
                    work currently in progress, and maximize efficiency.
                </p>

                {/* --- Create Button --- */}
                <div>
                    <Button type="submit" className="cursor-pointer bg-blue-500 hover:bg-blue-700">
                        Create
                    </Button>
                </div>

            </form>
        </div >
    );
};

// Default export for the App
export default CreateProjectModal;