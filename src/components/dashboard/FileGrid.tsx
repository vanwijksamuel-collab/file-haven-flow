import { useState } from "react";
import { MoreVertical, Download, Share2, Eye, Trash2, File, Image, FileText, Music, Video, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FilePreview } from "./FilePreview";
import { ShareDialog } from "./ShareDialog";

interface FileItem {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  uploadDate: Date;
  url: string;
  thumbnail?: string;
}

interface FileGridProps {
  files: FileItem[];
  onDelete: (fileId: string) => void;
}

export const FileGrid = ({ files, onDelete }: FileGridProps) => {
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [shareFile, setShareFile] = useState<FileItem | null>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type.startsWith('audio/')) return Music;
    if (type.includes('text') || type.includes('document')) return FileText;
    if (type.includes('zip') || type.includes('rar')) return Archive;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handleDownload = (file: FileItem) => {
    // Create a temporary link and click it to download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canPreview = (type: string) => {
    return type.startsWith('image/') || 
           type.startsWith('text/') || 
           type === 'application/pdf';
  };

  return (
    <>
      <div className="file-grid">
        {files.map((file, index) => {
          const FileIcon = getFileIcon(file.type);
          
          return (
            <Card
              key={file.id}
              className="glass hover-lift group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-4 space-y-4">
                {/* File Preview/Icon */}
                <div className="aspect-square rounded-lg bg-surface-elevated flex items-center justify-center overflow-hidden">
                  {file.thumbnail && file.type.startsWith('image/') ? (
                    <img
                      src={file.thumbnail}
                      alt={file.originalName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileIcon className="h-12 w-12 text-primary" />
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate" title={file.originalName}>
                        {file.originalName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        {canPreview(file.type) && (
                          <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDownload(file)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShareFile(file)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDelete(file.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canPreview(file.type) && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setPreviewFile(file)}
                        title="Preview"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDownload(file)}
                      title="Download"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShareFile(file)}
                      title="Share"
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Dialogs */}
      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {shareFile && (
        <ShareDialog
          file={shareFile}
          onClose={() => setShareFile(null)}
        />
      )}
    </>
  );
};