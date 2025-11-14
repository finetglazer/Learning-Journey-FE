import React from 'react';

// --- Mock Data ---
// Using data from your image and adding more for scrolling
const mockMembers = [
    {
        id: 1,
        name: 'Trần Mạnh Hùng',
        email: 'tranhung10122003@gmail.com',
        avatarUrl: 'https://placehold.co/40x40/E0E0E0/707070?text=TH',
        role: 'Owner',
        customRole: '<Custome name role>',
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
        role: 'Invited',
        customRole: 'Full-stack developer',
    },
    {
        id: 4,
        name: 'Lê Thị B',
        email: 'ltb@gmail.com',
        avatarUrl: 'https://placehold.co/40x40/E0E0E0/707070?text=LB',
        role: 'Member',
        customRole: 'Designer',
    },
    {
        id: 5,
        name: 'Phạm Văn C',
        email: 'pvc@gmail.com',
        avatarUrl: 'https://placehold.co/40x40/E0E0E0/707070?text=PC',
        role: 'Member',
        customRole: 'QA Engineer',
    },
    {
        id: 6,
        name: 'Trần Thị D',
        email: 'ttd@gmail.com',
        avatarUrl: 'https://placehold.co/40x40/E0E0E0/707070?text=TD',
        role: 'Invited',
        customRole: 'Marketing',
    },
];

export const TeamMembersViewModal = () => {
    return (
        <div className="w-full absolute top-[25%] left-[40%] max-w-lg p-8 bg-white rounded-2xl shadow-2xl">
            {/* --- Header --- */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Team members
            </h2>

            {/* --- Subheader --- */}
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Members
            </h3>

            {/* --- Member List Container --- */}
            {/* Added max-h-80 and overflow-y-auto to make it scrollable.
                    The scrollbar- classes are for styling the scrollbar (optional).
                */}
            <div className="relative max-h-80 overflow-y-auto rounded-lg bg-slate-50 p-4 space-y-4
                                scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">

                {mockMembers.map((member) => (
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

                        {/* Right part: Roles */}
                        <div className="flex items-center space-x-6">
                            <span className="text-sm text-blue-600">
                                {member.customRole}
                            </span>

                            <span className={`text-sm font-medium w-16 text-left ${member.role === 'Owner' ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                {member.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Default export for the App
export default TeamMembersViewModal;