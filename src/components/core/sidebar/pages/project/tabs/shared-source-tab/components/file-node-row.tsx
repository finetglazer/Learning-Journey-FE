import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn, getFileIcon } from "@/lib/utils";
import { FileNode } from "@/model/project-management";
import { MinusCircle } from "lucide-react";
import { useContext } from "react";
import { SharedSourceContext, SharedSourceContextProps } from "../shared-source-context";

export const FileNodeRow = ({
    node,
    onOpenFolder,
    onDelete,
    canDelete = true,
    isSticky = false,
}: {
    node: FileNode,
    onOpenFolder: (node: FileNode) => void,
    onDelete: (nodeId: number) => void,
    canDelete?: boolean,
    isSticky?: boolean,
}) => {
    const isFolder = node.type === 'FOLDER';

    const {
        onCancelAddFolder,
        editingFile,
    } = useContext<SharedSourceContextProps>(SharedSourceContext);

    return (
        <TableRow
            className={cn(
                "bg-white border-b border-gray-100 h-12 transition-colors",
                isSticky ? "sticky top-0 z-10 font-semibold" : "hover:bg-gray-50",
                isFolder && "cursor-pointer hover:bg-gray-100"
            )}
            onClick={() => { if (isFolder && !isSticky) onOpenFolder(node); }}
        >
            <TableCell
                className={cn(
                    "w-1/2 flex items-center gap-3",
                    isSticky ? "font-semibold text-gray-700" : ""
                )}
            >
                {getFileIcon(node.extension || '', node.type)}
                {editingFile?.nodeId === node.nodeId ? (
                    <input
                        type="text"
                        defaultValue={node.name}
                        className={cn(
                            "text-gray-800 truncate bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500",
                            isFolder && "font-medium"
                        )}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className={cn("text-gray-800 truncate", isFolder && "font-medium")}>
                        {node.name}
                    </span>
                )}
            </TableCell>

            <TableCell className="text-gray-500">
                {/* Logic for shared row author */}
                {isSticky ? "Community" : (node.createdByUserId ? `User ${node.createdByUserId}` : 'N/A')}
            </TableCell>

            <TableCell className="text-gray-500">
                {/* Logic for shared row date */}
                {isSticky ? "1/12/2025" : (node.updatedAt ? new Date(node.updatedAt).toLocaleDateString() : 'N/A')}
            </TableCell>

            <TableCell className="text-right w-16">
                {canDelete && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(node.nodeId);
                        }}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                        <MinusCircle className="h-4 w-4" />
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
};