import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Video, Play, Plus } from "lucide-react";
import { useVideoEditorStore } from "@/stores/videoEditorStore";
import { useToast } from "@/hooks/use-toast";

export const MediaLibrary = () => {
  const { mediaLibrary, addMediaFile, addClipToTimeline, project } = useVideoEditorStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.type.startsWith('video/')) {
        addMediaFile(file);
        toast({
          title: "Video added",
          description: `${file.name} added to media library`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a video file (MP4, MOV, WebM)",
          variant: "destructive",
        });
      }
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('video/')) {
        addMediaFile(file);
        toast({
          title: "Video added",
          description: `${file.name} added to media library`,
        });
      }
    });
  };

  const handleAddToTimeline = (file: File) => {
    if (!project) {
      toast({
        title: "No project",
        description: "Create a project first",
        variant: "destructive",
      });
      return;
    }
    
    const position = project.currentTime || project.duration || 0;
    addClipToTimeline(file, position);
    toast({
      title: "Clip added",
      description: `${file.name} added to timeline`,
    });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Video className="h-5 w-5 mr-2" />
          Media Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className="upload-area p-6 text-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-3">
            Drag & drop videos here
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Media Items */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {mediaLibrary.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No videos uploaded yet</p>
            </div>
          ) : (
            mediaLibrary.map((file, index) => (
              <MediaItem
                key={`${file.name}-${index}`}
                file={file}
                onAddToTimeline={() => handleAddToTimeline(file)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface MediaItemProps {
  file: File;
  onAddToTimeline: () => void;
}

const MediaItem = ({ file, onAddToTimeline }: MediaItemProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div
      className="flex items-center space-x-3 p-3 rounded-lg border border-border/20 bg-surface/50 hover:bg-surface/80 transition-colors group cursor-pointer"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
          type: 'media-file',
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
          }
        }));
      }}
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-8 bg-primary/20 rounded flex items-center justify-center">
          <Play className="h-4 w-4 text-primary" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
      </div>
      
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onAddToTimeline}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};