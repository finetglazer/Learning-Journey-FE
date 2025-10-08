import { TableCell } from "@/components/ui/table";
import { useDroppable } from "@dnd-kit/core";

export const DroppableCell = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    }); 

    const style = {
        backgroundColor: isOver ? '#E0F2FE' : undefined
    };

    return (
        <TableCell ref={setNodeRef} style={style} className="relative border-r-2 min-w-16.5 max-w-16.5">
            {children}
        </TableCell>
    );
}