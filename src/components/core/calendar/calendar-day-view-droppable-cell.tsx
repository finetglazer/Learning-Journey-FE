import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

export const CalendarDayViewDroppableCell = ({ 
    id, 
    children,
    bordered = true,
    wrapperClassName,
    onClick,
}: { 
    id: string; 
    children: React.ReactNode; 
    bordered?: boolean;
    wrapperClassName?: string;
    onClick?: () => void;
}) => {
    const { isOver, active, setNodeRef } = useDroppable({
        id: id,
    }); 

    const style = {
        backgroundColor: isOver && active?.id !== "draggable-panel" ? '#E0F2FE' : undefined
    };

    return (
        <div ref={setNodeRef} style={style} className={cn("relative w-full h-[4rem] -mt-2", { "border-r-2": bordered }, wrapperClassName)}>
            {children}
        </div>
    );
}