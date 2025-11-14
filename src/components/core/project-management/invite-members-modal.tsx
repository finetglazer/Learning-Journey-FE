import { useState } from "react";

const MinusCircle = ({ className, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className || "w-5 h-5 cursor-pointer"}
        {...props}
    >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

const initialMembers = [
    {
        id: 1,
        name: 'Trần Mạnh Hùng',
        email: 'tranhung10122003@gmail.com',
        avatarUrl: 'https://placehold.co/40x40/E0E0E0/707070?text=TH',
        role: 'Owner',
        customRole: null,
    },
    {
        id: 2,
        name: 'Đoàn Duy Chinh',
        email: 'chinh1012@gmail.com',
        avatarUrl: 'https://placehold.co/40x40/E0E0E0/707070?text=DC',
        role: 'Member',
        customRole: 'Xach nuoc bo cam',
    },
    {
        id: 3,
        name: 'Nguyễn Vĩnh Hiệp',
        email: 'vinhhiepbn2003.work@gmail.com',
        avatarUrl: 'https://placehold.co/40x40/E0E0E0/707070?text=NH',
        role: 'Member',
        customRole: 'Full-stack developer',
    },
];

export const InviteMembersModal = () => {
    const [inviteEmail, setInviteEmail] = useState('');
    const [members, setMembers] = useState(initialMembers);

    // State for the warning dialog
    const [showWarning, setShowWarning] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);

    const handleInvite = (e) => {
        e.preventDefault();
        if (inviteEmail) {
            console.log('Inviting:', inviteEmail);
            // Add your invite logic here
            setInviteEmail('');
        }
    };

    // --- Warning Dialog Handlers ---

    // 1. When user clicks the remove icon
    const onRemoveClick = (member) => {
        setMemberToRemove(member);
        setShowWarning(true);
    };

    // 2. When user clicks "Cancel" in the dialog
    const handleCancelRemove = () => {
        setShowWarning(false);
        setMemberToRemove(null);
    };

    // 3. When user clicks "Proceed anyway"
    const handleConfirmRemove = () => {
        setMembers(members.filter(m => m.id !== memberToRemove.id));
        setShowWarning(false);
        setMemberToRemove(null);
    };

    return (
        <>
            {/* --- Modal Card --- */}
            <div className="w-full absolute top-[25%] left-[40%] max-w-lg p-8 bg-white rounded-2xl shadow-2xl">
                {/* --- Header --- */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Invite new team member
                </h2>

                {/* --- Invite Input Section --- */}
                <form onSubmit={handleInvite}>
                    <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-800 mb-2">
                        Invite members
                    </label>
                    <div className="relative">
                        <input
                            id="inviteEmail"
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm
                                           focus:outline-none focus:ring-2 focus:ring-blue-500
                                           pr-20"
                        />
                        <button
                            type="submit"
                            className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-sm font-medium
                                           text-green-800 bg-green-100 rounded-lg
                                           hover:bg-green-200"
                        >
                            Invite
                        </button>
                    </div>
                </form>

                <p className="text-sm text-gray-500 mt-2 mb-6">
                    Filling the email of members you want to invite
                </p>

                {/* --- Members List Section --- */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Members
                </h3>

                {/* Fading, scrollable container for members */}
                <div className="relative max-h-60 overflow-y-auto -mx-2 px-2
                                    [mask-image:linear-gradient(to_bottom,white_90%,transparent_100%)]">
                    <div className="space-y-4">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between">
                                {/* Left part: Avatar and Info */}
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={member.avatarUrl}
                                        alt={member.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://placehold.co/40x40/E0E0E0/707070?text=${member.name[0] || 'A'}`;
                                        }}
                                    />
                                    <div>
                                        <div className="font-semibold text-sm text-gray-900">
                                            {member.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {member.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Right part: Role and Actions */}
                                <div className="flex items-center space-x-4">
                                    {/* This is the editable role field.
                                            In a real app, clicking this would toggle an input field.
                                        */}
                                    <button className="text-sm text-blue-600 hover:text-blue-800">
                                        {member.customRole || '<Custome name role>'}
                                    </button>

                                    <span className={`text-sm font-medium ${member.role === 'Owner' ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        {member.role}
                                    </span>

                                    {member.role !== 'Owner' ? (
                                        <button
                                            onClick={() => onRemoveClick(member)}
                                            className="text-gray-400 hover:text-red-500"
                                            aria-label="Remove member"
                                        >
                                            <MinusCircle className={""} />
                                        </button>
                                    ) : (
                                        // Placeholder for spacing
                                        <div className="w-5 h-5"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Render the Warning Dialog (conditionally) --- */}
            {/* {showWarning && (
                <WarningDialog
                    onConfirm={handleConfirmRemove}
                    onCancel={handleCancelRemove}
                />
            )} */}
        </>
    );
};

export default InviteMembersModal;