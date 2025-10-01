import { cn } from '@/lib/utils';

export interface TagProps {
    content?: string;
    type?: "event" | "task" | "routine";
};

const capitalize = (s: string) => {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export const Tag = ({ type = 'event', content }: TagProps) => {
    const typeColorMap = {
        event: 'bg-[#33C6F7]',
        task: 'bg-[#E5487A]',
        routine: 'bg-[#83EB91]',
    };

    const displayText = content || capitalize(type);

    return (
        <div
            className={cn(
                'inline-flex items-center justify-center',
                'py-2 px-6 rounded-2xl',
                'text-white text-xl font-bold font-sans',
                typeColorMap[type]
            )}
        >
            {displayText}
        </div>
    );
};