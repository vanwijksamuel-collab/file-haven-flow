import { useState } from "react";
import { MoreVertical, Download, Share2, Eye, Trash2, File, Image, FileText, Music, Video, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface FileListProps {
  files: FileItem[];
  onDelete: (fileId: string) => void;
}

export const FileList = ({ files, onDelete }: FileListProps) => {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDownload = (file: FileItem) => {
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
      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border/20">
          <div className="col-span-6 md:col-span-5">Name</div>
          <div className="hidden md:block col-span-2">Type</div>
          <div className="col-span-3 md:col-span-2">Size</div>
          <div className="hidden md:block col-span-2">Modified</div>
          <div className="col-span-3 md:col-span-1">Actions</div>
        </div>

        {/* Files */}
        {files.map((file, index) => {
          const FileIcon = getFileIcon(file.type);
          
          return (
            <div
              key={file.id}
              className="glass rounded-lg px-4 py-3 hover-lift animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Name with icon/thumbnail */}
                <div className="col-span-6 md:col-span-5 flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-surface-elevated flex items-center justify-center flex-shrink-0">
                    {file.thumbnail && file.type.startsWith('image/') ? (
                      <img
                        src={file.thumbnail}
                        alt={file.originalName}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <FileIcon className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate" title={file.originalName}>
                      {file.originalName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {file.name}
                    </p>
                  </div>
                </div>

                {/* Type */}
                <div className="hidden md:block col-span-2">
                  <span className="text-xs px-2 py-1 bg-surface-elevated rounded-full">
                    {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                </div>

                {/* Size */}
                <div className="col-span-3 md:col-span-2 text-sm">
                  {formatFileSize(file.size)}
                </div>

                {/* Modified */}
                <div className="hidden md:block col-span-2 text-sm text-muted-foreground">
                  {formatDate(file.uploadDate)}
                </div>

                {/* Actions */}
                <div className="col-span-3 md:col-span-1 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
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
              </div>
            </div>
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