import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { projectRepository } from '@/repository/project-repository';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AlertMessage, AlertModal } from '../alert-modal/alert-modal';
import { toast } from 'sonner';

type CreateProjectModalProps = {
    onClose: () => void;
    handleReload: () => void;
};

export const CreateProjectModal = ({ onClose, handleReload }: CreateProjectModalProps) => {
    const [projectName, setProjectName] = useState('');
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);
    const [ownerInfo, setOwnerInfo] = useState({
        name: '...',
        email: '...',
        avatarUrl: 'https://placehold.co/40x40/E0E0E0/707070?text=..',
        role: 'Owner',
    });

    const createProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        projectRepository.createProject({
            name: projectName,
        }).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    onClose();
                    handleReload();
                }
                else {
                    setAlertMessage({
                        type: "warning",
                        title: res?.message || res?.msg,
                        description: res?.data,
                    });
                }
            },
            error: err => {
                const errors = err?.response?.data?.data;
                const message = err?.response?.data?.msg || err?.response?.data?.message;
                setAlertMessage({
                    type: "warning",
                    title: message,
                    description: errors,
                });
            }
        });
    };

    useEffect(() => {
        const name = localStorage.getItem('displayName');
        const email = localStorage.getItem('email');
        const avatarUrl = localStorage.getItem('avatarUrl');
        setOwnerInfo({
            name: name || '...',
            email: email || '...',
            avatarUrl: avatarUrl || 'https://placehold.co/40x40/E0E0E0/707070?text=..',
            role: 'Owner',
        });
    }, []);

    return (
        <div className="w-full absolute top-[25%] left-[40%] max-w-lg p-8 bg-white rounded-2xl shadow-2xl items-center">

            <Button
                type="button" // Prevents submitting the form
                variant="ghost"
                size="icon"
                className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-900"
                onClick={onClose}
            >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </Button>

            <form onSubmit={createProject}>

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
                                src={ownerInfo.avatarUrl}
                                alt={ownerInfo.name}
                                className="w-10 h-10 rounded-full object-cover"
                                // Handle image loading error
                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://placehold.co/40x40/E0E0E0/707070?text=..';
                                }}
                            />
                            <div>
                                <div className="font-semibold text-sm text-gray-900">
                                    {ownerInfo.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {ownerInfo.email}
                                </div>
                            </div>
                        </div>

                        <span className="text-sm font-medium text-gray-500">
                            {ownerInfo.role}
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
            {alertMessage && (
                <AlertModal
                    alertMessage={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </div >
    );
};

// Default export for the App
export default CreateProjectModal;