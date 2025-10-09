import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

export const CalendarWeekViewDroppableCell = ({ 
    id, 
    children,
    bordered = true,
    wrapperClassName 
}: { 
    id: string; 
    children: React.ReactNode; 
    bordered?: boolean;
    wrapperClassName?: string;
}) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    }); 

    const style = {
        backgroundColor: isOver ? '#E0F2FE' : undefined
    };

    return (
        <TableCell ref={setNodeRef} style={style} className={cn("relative w-full h-[4rem] -mt-2", { "border-r-2": bordered }, wrapperClassName)}>
            {children}
        </TableCell>
    );
}