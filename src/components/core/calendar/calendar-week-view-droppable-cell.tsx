import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

export const CalendarWeekViewDroppableCell = ({
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
    onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
}) => {
    const { isOver, active, setNodeRef } = useDroppable({
        id: id,
    });

    const style = {
        backgroundColor: isOver && active?.id !== "draggable-panel" ? '#E0F2FE' : undefined
    };

    return (
        <TableCell
            ref={setNodeRef}
            style={style}
            className={cn("relative cursor-pointer w-full h-[4rem] -mt-2", { "border-r-2": bordered }, wrapperClassName)}
            onClick={onClick}
        >
            {children}
        </TableCell>
    );
}