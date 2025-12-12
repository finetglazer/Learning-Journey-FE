"use client";

import { useState, useRef, useEffect, useContext } from 'react';
import { User, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { AlertMessage, AlertModal } from '@/components/core/alert-modal/alert-modal';
import { toDayJs } from '@/lib/utils';
import { AppContext, AppContextProps } from '@/hooks/app-context';

const Button = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={`px-5 py-2 text-sm font-medium rounded-md shadow-sm transition-colors ${className}`}
        {...props}
    >
        {children}
    </button>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        {...props}
    />
);

const Label = ({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label
        className="block text-sm font-medium text-gray-700 mb-1"
        {...props}
    >
        {children}
    </label>
);

export const PublicProfile = () => {
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [alertMessage, setAlertMessage] = useState<AlertMessage | null>(null);

    // Ref for the hidden file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = () => {
        // Trigger the hidden file input
        fileInputRef.current?.click();
    };

    const {
        userRepository,
        setDisplayName,
        setAvatarUrl,
        setEmail,
    } = useContext<AppContextProps>(AppContext);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a preview URL for the selected image
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getProfile = () => {
        userRepository?.getProfile().subscribe({
            next: res => {
                if (res?.status) {
                    const name = res?.data?.name;
                    const dateOfBirth = res?.data?.dateOfBirth;
                    const avatarUrl = res?.data?.avatarUrl;
                    const email = res?.data?.email;

                    setDisplayName(name);
                    setAvatarUrl(avatarUrl);
                    setEmail(email);

                    setName(name);
                    setDob(toDayJs(dateOfBirth, 0).format("DD/MM/YYYY"));
                    setProfilePic(avatarUrl);
                }
                else {
                    toast.error(res?.message || res?.msg);
                }
            },
            error: err => { },
        });
    };

    const updateProfile = () => {
        const formData = new FormData;
        formData.append('name', name);
        formData.append('dateOfBirth', dob);
        formData.append('avatar', selectedFile as File);
        userRepository?.updateProfile(formData).subscribe({
            next: res => {
                if (res?.status) {
                    toast.success(res?.message || res?.msg);
                    getProfile();
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
        getProfile();
    }, []);

    return (
        <div className="p-10 max-w-4xl mx-auto h-full overflow-y-auto ml-0 bg-white">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Public profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* --- Left Column: Form Fields --- */}
                <div className="md:col-span-2 space-y-6">
                    {/* Name Field */}
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Your name may appear around the app where you are mentioned or represented.
                        </p>
                    </div>

                    {/* Date of Birth Field */}
                    <div>
                        <Label htmlFor="dob">Date of birth</Label>
                        <Input
                            id="dob"
                            type="text"
                            placeholder="dd/mm/yyyy"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Form: dd/mm/yyyy. We will add this as an event in your private calendar.
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="pt-2">
                        <Button
                            onClick={updateProfile}
                            // Matching the teal/green color from your image
                            className="bg-teal-400 text-white hover:bg-teal-600 cursor-pointer"
                        >
                            Save
                        </Button>
                    </div>
                </div>

                {/* --- Right Column: Profile Picture --- */}
                <div className="md:col-span-1">
                    <Label>Profile picture</Label>
                    <div className="relative w-40 h-40 mx-auto md:mx-0">
                        {/* Profile Picture Display */}
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-300 to-cyan-500 flex items-center justify-center overflow-hidden">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-20 h-20 text-white opacity-70" />
                            )}
                        </div>

                        {/* Edit Button */}
                        <Button
                            onClick={handleEditClick}
                            className="absolute cursor-pointer bottom-2 gap-1.5 right-0 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 !px-3 !py-1.5 flex items-center justify-center"
                            aria-label="Edit profile picture"
                        >
                            <Pencil size={16} className="mr-0" />
                            Edit
                        </Button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                    />
                </div>
            </div>
            {alertMessage && (
                <AlertModal
                    alertMessage={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}
        </div>
    );
};