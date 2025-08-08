import { X, Download, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

interface FilePreviewProps {
  file: FileItem;
  onClose: () => void;
}

export const FilePreview = ({ file, onClose }: FilePreviewProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="flex justify-center items-center max-h-[60vh] overflow-hidden rounded-lg bg-surface-elevated">
          <img
            src={file.url}
            alt={file.originalName}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    if (file.type.startsWith('text/')) {
      return (
        <div className="glass rounded-lg p-6 max-h-[60vh] overflow-auto">
          <iframe
            src={file.url}
            className="w-full h-96 border-0"
            title={file.originalName}
          />
        </div>
      );
    }

    if (file.type === 'application/pdf') {
      return (
        <div className="glass rounded-lg overflow-hidden max-h-[60vh]">
          <iframe
            src={file.url}
            className="w-full h-96 border-0"
            title={file.originalName}
          />
        </div>
      );
    }

    return (
      <div className="glass rounded-lg p-12 text-center">
        <div className="space-y-4">
          <ExternalLink className="h-16 w-16 text-muted-foreground mx-auto" />
          <div>
            <h4 className="font-medium mb-2">Preview not available</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This file type cannot be previewed in the browser.
            </p>
            <Button onClick={handleDownload} variant="hero">
              <Download className="h-4 w-4 mr-2" />
              Download File
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full glass">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate pr-4">{file.originalName}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon-sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon-sm">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {file.type} • {(file.size / 1024 / 1024).toFixed(1)} MB
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};