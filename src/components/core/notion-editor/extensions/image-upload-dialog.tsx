"use client";

import React, { useState, useRef, useContext } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppContext, AppContextProps } from "@/hooks/app-context";
import { toast } from "sonner";
import { Upload, Link } from "lucide-react";

interface ImageUploadDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (imageUrl: string) => void;
    projectId: number | string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

export function ImageUploadDialog({ isOpen, onClose, onInsert, projectId }: ImageUploadDialogProps) {
    const [activeTab, setActiveTab] = useState<string>("upload");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { projectRepository } = useContext<AppContextProps>(AppContext);

    const validateImageFile = (file: File): boolean => {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            toast.error("Unsupported image type. Please upload a JPEG, PNG, GIF, or WebP image.");
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Image size exceeds 10MB limit");
            return false;
        }
        return true;
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && validateImageFile(file)) {
            setSelectedFile(file);
        } else {
            // Reset the input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select an image file");
            return;
        }

        if (!projectRepository) {
            toast.error("Repository not available");
            return;
        }

        setUploading(true);

        projectRepository.uploadEditorImage({ projectId }, selectedFile).subscribe({
            next: (response) => {
                if (response?.status) {
                    const url = response.data?.url;
                    console.log(response.data);
                    if (url) {
                        onInsert(url);
                        toast.success("Image uploaded successfully");
                        handleClose();
                    } else {
                        toast.error("Upload failed: No URL returned");
                    }
                } else {
                    toast.error(response?.message || "Upload failed");
                }
                setUploading(false);
            },
            error: (err) => {
                console.error("Image upload error:", err);
                toast.error(err?.error?.message || "Failed to upload image");
                setUploading(false);
            },
        });
    };

    const handleInsertUrl = () => {
        if (!imageUrl.trim()) {
            toast.error("Please enter an image URL");
            return;
        }

        // Basic URL validation
        try {
            new URL(imageUrl);
            onInsert(imageUrl);
            toast.success("Image inserted");
            handleClose();
        } catch {
            toast.error("Please enter a valid URL");
        }
    };

    const handleClose = () => {
        // Reset state
        setSelectedFile(null);
        setImageUrl("");
        setActiveTab("upload");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add an Image</DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                        </TabsTrigger>
                        <TabsTrigger value="url">
                            <Link className="w-4 h-4 mr-2" />
                            Embed URL
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file-upload">Select Image</Label>
                            <Input
                                id="file-upload"
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handleFileSelect}
                                disabled={uploading}
                            />
                            {selectedFile && (
                                <p className="text-sm text-gray-500">
                                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={handleClose} disabled={uploading}>
                                Cancel
                            </Button>
                            <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
                                {uploading ? "Uploading..." : "Upload & Insert"}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="image-url">Image URL</Label>
                            <Input
                                id="image-url"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleInsertUrl();
                                    }
                                }}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleInsertUrl} disabled={!imageUrl.trim()}>
                                Insert
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
