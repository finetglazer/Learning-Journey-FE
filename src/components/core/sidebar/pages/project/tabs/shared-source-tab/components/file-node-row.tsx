import { FilePreviewModal } from "@/components/core/file-preview/file-preview-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { FILE_EXTENSION } from "@/const/consts";
import { cn, getFileIcon } from "@/lib/utils";
import { FileNode, ProjectMembershipRole } from "@/model/project-management";
import { isEqual } from "lodash";
import { Loader2, MoreVerticalIcon } from "lucide-react";
import { useContext, useState } from "react";
import { TeamProjectContext, TeamProjectContextProps } from "../../../team-project-context";
import { SharedSourceContext, SharedSourceContextProps } from "../shared-source-context";

export const FileNodeRow = ({
    node,
    onOpenFolder,
    isSticky = false,
}: {
    node: FileNode,
    onOpenFolder: (node: FileNode) => void,
    isSticky?: boolean,
}) => {
    const isFolder = node.type === 'FOLDER';
    const isUploading = node.uploadingId !== undefined;
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // File types that support preview
    const isPreviewable = !isFolder && node.storageReference && FILE_EXTENSION.includes(node.extension?.toLowerCase() || '');

    const {
        currentMember,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const {
        onCancelAddOrEditFolder,
        onConfirmAddFolder,
        editingFile,
        setEditingFile,
        isAddingFolder,
        onConfirmEditFileName,
        onConfirmDeleteFile,
        setAlertMessage,
    } = useContext<SharedSourceContextProps>(SharedSourceContext);

    const menu: any = [
        {
            label: 'Preview',
            onClick: () => setIsPreviewOpen(true),
            isShow: isPreviewable,
        },
        {
            label: 'Delete '.concat(isFolder ? "folder" : "file"),
            onClick: () => {
                setAlertMessage({
                    type: "warning",
                    title: "Delete " + (isFolder ? "folder" : "file"),
                    description: "Are you sure you want to delete this " + (isFolder ? "folder" : "file") + "?",
                    proceedAnyway: () => onConfirmDeleteFile(node.nodeId),
                    useCancel: true,
                })
            },
            isShow: (isEqual(node.createdByUserId, currentMember?.userId) || isEqual(currentMember?.role, ProjectMembershipRole.OWNER))
                && !isEqual(node.nodeId, -1),
        },
        {
            label: 'Edit '.concat(isFolder ? "folder" : "file").concat(" name"),
            onClick: () => setEditingFile(node),
            isShow: !isEqual(node.nodeId, -1),
        },
    ];
    
    const onClickFile = () => {
        setIsPreviewOpen(true);
    };

    return (
        <TableRow
            className={cn(
                "bg-white border-b border-gray-100 h-12 transition-colors cursor-pointer",
                isSticky ? "sticky top-0 z-10 font-semibold" : "hover:bg-gray-50",
                isFolder && !isUploading && "cursor-pointer hover:bg-gray-100",
                isUploading && "opacity-50 pointer-events-none bg-gray-100"
            )}
            onClick={() => {
                if (isFolder && !isSticky && !isUploading) onOpenFolder(node);
                else if (!isFolder && !isUploading && !isPreviewOpen) onClickFile();
            }}
        >
            <TableCell
                className={cn(
                    "w-1/2 flex items-center gap-3 group",
                    isSticky ? "font-semibold text-gray-700" : ""
                )}
            >
                {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                ) : (
                    getFileIcon(node.extension || '', node.type)
                )}
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                isAddingFolder ? onConfirmAddFolder(e.currentTarget.value) : onConfirmEditFileName(e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                                e.preventDefault();
                                onCancelAddOrEditFolder();
                            }
                        }}
                        onBlur={(e) => {
                            // If the user clicks outside, cancel the add folder
                            onCancelAddOrEditFolder();
                        }}
                    />
                ) : (
                    <div className="flex items-center gap-2 group mt-1 group">
                        <span className={cn("text-gray-800 truncate", isFolder && "font-medium", isUploading && "text-gray-400")}>
                            {node.name}
                        </span>
                    </div>
                )}
            </TableCell>

            <TableCell className={cn("text-gray-500", isUploading && "text-gray-300")}>
                {/* Logic for shared row author */}
                {isSticky ? "Community" : (node.createdByUserId ? `User ${node.createdByUserId}` : 'N/A')}
            </TableCell>

            <TableCell className={cn("text-gray-500", isUploading && "text-gray-300")}>
                {/* Logic for shared row date */}
                {isSticky ? "1/12/2025" : (node.updatedAt ? new Date(node.updatedAt).toLocaleDateString() : 'N/A')}
            </TableCell>

            <TableCell className="text-right w-16">
                {(!isEqual(node.nodeId, -1) && !isUploading) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:text-gray-600 cursor-pointer">
                                <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {menu.filter((item: any) => item.isShow).map((item: any, index: number) => (
                                <DropdownMenuItem
                                    key={index}
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        item.onClick();
                                    }}
                                    disabled={!item.isShow}
                                >
                                    {item.icon && item.icon}
                                    <span className={cn({ "text-red-400": (item.label as string).toLowerCase().includes("delete") })}>{item.label}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </TableCell>

            {/* File Preview Modal */}
            {isPreviewable && (
                <FilePreviewModal
                    isOpen={isPreviewOpen}
                    onClose={() => {
                        setIsPreviewOpen(false);
                    }}
                    fileUrl={node.storageReference || ''}
                    fileName={node.name + (node.extension ? `.${node.extension}` : '')}
                    fileExtension={node.extension || ''}
                />
            )}
        </TableRow>
    );
};