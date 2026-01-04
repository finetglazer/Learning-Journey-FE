import { FilePreviewModal } from "@/components/core/file-preview/file-preview-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn, getFileIcon } from "@/lib/utils";
import { FileNode, ProjectMembershipRole } from "@/model/project-management";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { isEqual } from "lodash";
import { Loader2, MoreVerticalIcon } from "lucide-react";
import { useContext, useState } from "react";
import { TeamProjectContext, TeamProjectContextProps } from "../../../team-project-context";
import { SharedSourceContext, SharedSourceContextProps } from "../shared-source-context";
import { useRouter } from "next/navigation";
import { CSS } from "@dnd-kit/utilities";

export const FileNodeRow = ({
    node,
    onOpenFolder,
    isSticky = false,
}: {
    node: FileNode,
    onOpenFolder: (node: FileNode) => void,
    isSticky?: boolean,
}) => {
    const router = useRouter();
    const isFolder = node.type === 'FOLDER' || node.type === 'SHARED_FOLDER';
    const isUploading = node.uploadingId !== undefined;
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const isSharedPosts = node.type === 'SHARED_FOLDER';
    const isDraggable = !isSticky && !isUploading && !isSharedPosts && node.nodeId > 0;
    const isDroppable = !isSticky && !isUploading && node.type === 'FOLDER' && !isSharedPosts && node.nodeId > 0;

    const { attributes, listeners, setNodeRef: setDraggableRef, transform, isDragging } = useDraggable({
        id: node.nodeId.toString(),
        disabled: !isDraggable,
    });

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: node.nodeId.toString(),
        disabled: !isDroppable,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : "auto",
        position: isDragging ? "relative" as const : undefined,
    };

    // File types that support preview
    const isPreviewable = !isFolder && node.type !== 'NOTION_DOC';

    const {
        currentMember,
    } = useContext<TeamProjectContextProps>(TeamProjectContext);

    const {
        onCancelAddOrEdit,
        onConfirmAddFolder,
        onConfirmAddDocument,
        editingFile,
        setEditingFile,
        isAddingFolder,
        isAddingDocument,
        onConfirmEditFileName,
        onConfirmDeleteFile,
        setAlertMessage,
        selectedNodeId,
        setSelectedNodeId,
        cutNodeId,
        setCutNodeId,
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
            isShow: (isEqual(node.createdBy, currentMember?.userId) || isEqual(currentMember?.role, ProjectMembershipRole.OWNER))
                && !isEqual(node.nodeId, -1),
        },
        {
            label: 'Edit '.concat(isFolder ? "folder" : "file").concat(" name"),
            onClick: () => setEditingFile(node),
            isShow: !isEqual(node.nodeId, -1),
        },
    ];

    const onClickFile = () => {
        if (node.type === 'SHARED_FILE') {
            const originalId = -10000 - node.nodeId;
            router.push(`/posts/${originalId}`);
            return;
        }

        if (isPreviewable) {
            setIsPreviewOpen(true);
            return;
        }
        // For NOTION_DOC, open in new tab
        if (node.type === 'NOTION_DOC') {
            router.push(`/projects/files?id=${node.nodeId}`);
            return;
        }
    };

    // Combine refs
    const setNodeRef = (element: HTMLTableRowElement | null) => {
        setDraggableRef(element);
        setDroppableRef(element);
    }

    const isSelected = selectedNodeId === node.nodeId;
    const isCut = cutNodeId === node.nodeId;

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "bg-white border-b border-gray-100 h-12 transition-colors cursor-pointer",
                isSticky ? "sticky top-0 z-10 font-semibold" : "hover:bg-gray-50",
                isFolder && !isUploading && "cursor-pointer hover:bg-gray-100",
                isUploading && "opacity-50 pointer-events-none bg-gray-100",
                isOver && "bg-blue-50 border-2 border-blue-500",
                isSelected && !isSticky && "bg-blue-100 hover:bg-blue-100",
                isCut && "opacity-50 border-dashed border-2 border-gray-300"
            )}
            onClick={(e) => {
                // Single click to select
                if (!isSticky && !isUploading) {
                    e.stopPropagation();
                    setSelectedNodeId(node.nodeId);
                }
            }}
            onDoubleClick={(e) => {
                // Double click to open
                e.stopPropagation();

                // If this node is currently cut, cancel the cut
                if (isCut) {
                    setCutNodeId(null);
                    return;
                }

                if (isFolder && !isUploading) onOpenFolder(node);
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
                                if (isAddingFolder) {
                                    onConfirmAddFolder(e.currentTarget.value);
                                } else if (isAddingDocument) {
                                    onConfirmAddDocument(e.currentTarget.value);
                                } else {
                                    onConfirmEditFileName(e.currentTarget.value);
                                }
                            } else if (e.key === 'Escape') {
                                e.preventDefault();
                                onCancelAddOrEdit();
                            }
                        }}
                        onBlur={(e) => {
                            // If the user clicks outside, cancel the add folder
                            onCancelAddOrEdit();
                        }}
                    />
                ) : (
                    <div className="flex items-center gap-2 group mt-1 group">
                        <button className={cn("text-gray-800 truncate cursor-pointer", isFolder && "font-medium", isUploading && "text-gray-400")}>
                            {node.name}
                        </button>
                    </div>
                )}
            </TableCell>

            <TableCell className={cn("text-gray-500", isUploading && "text-gray-300")}>
                {/* Logic for shared row author */}
                {isSticky ? "Community" : (node.createdBy || 'N/A')}
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