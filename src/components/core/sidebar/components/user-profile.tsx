import { User } from "lucide-react";

export const UserProfile = () => (
    <div className="p-4 border-b 
    border-gray-200">
        <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <User size={20} className="text-gray-600" />
            </span>
            <div>
                <div className="font-semibold text-sm text-gray-900">Tran Manh Hung</div>
                <div className="text-xs text-gray-500">tranhung10122003@gmail.com</div>
            </div>
        </div>
    </div>
);