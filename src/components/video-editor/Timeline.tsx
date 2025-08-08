import { useRef, useState, useCallback } from "react";
import { useVideoEditorStore } from "@/stores/videoEditorStore";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Scissors, Trash2 } from "lucide-react";
import Draggable from "react-draggable";

interface TimelineProps {
  currentTime: number;
  onSeek: (time: number) => void;
}

export const Timeline = ({ currentTime, onSeek }: TimelineProps) => {
  const { 
    project, 
    selectedClip,
    selectClip,
    moveClip,
    splitClip,
    deleteClip,
    setZoom 
  } = useVideoEditorStore();
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const pixelsPerSecond = 50 * (project?.zoom || 1);
  const totalWidth = (project?.duration || 0) * pixelsPerSecond;

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current || !project) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = x / pixelsPerSecond;
    onSeek(Math.max(0, Math.min(time, project.duration)));
  };

  const handleClipSelect = (clipId: string) => {
    selectClip(selectedClip?.id === clipId ? null : clipId);
  };

  const handleClipDrag = useCallback((clipId: string, data: any) => {
    const newPosition = Math.max(0, data.x / pixelsPerSecond);
    moveClip(clipId, newPosition);
  }, [moveClip, pixelsPerSecond]);

  const handleSplitClip = () => {
    if (!selectedClip) return;
    splitClip(selectedClip.id, currentTime);
  };

  const handleDeleteClip = () => {
    if (!selectedClip) return;
    deleteClip(selectedClip.id);
  };

  const handleZoomIn = () => {
    if (project) {
      setZoom(Math.min(project.zoom * 1.5, 5));
    }
  };

  const handleZoomOut = () => {
    if (project) {
      setZoom(Math.max(project.zoom / 1.5, 0.1));
    }
  };

  if (!project) return null;

  return (
    <div className="space-y-4">
      {/* Timeline Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground min-w-16 text-center">
            {Math.round(project.zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {selectedClip && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSplitClip}>
              <Scissors className="h-4 w-4" />
              Split
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteClip}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Timeline Container */}
      <div className="bg-surface-elevated rounded-lg border border-border/20 overflow-hidden">
        {/* Time Ruler */}
        <div className="h-8 bg-muted/50 border-b border-border/20 relative">
          <div 
            className="h-full relative"
            style={{ width: Math.max(totalWidth, 800) }}
          >
            {/* Time markers */}
            {Array.from({ length: Math.ceil(project.duration) + 1 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full border-l border-border/30"
                style={{ left: i * pixelsPerSecond }}
              >
                <span className="absolute top-1 left-1 text-xs text-muted-foreground">
                  {formatTimeRuler(i)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Track */}
        <div 
          ref={timelineRef}
          className="h-24 bg-surface relative cursor-pointer overflow-x-auto"
          onClick={handleTimelineClick}
          style={{ minWidth: '100%' }}
        >
          <div 
            className="h-full relative"
            style={{ width: Math.max(totalWidth, 800) }}
          >
            {/* Video Clips */}
            {project.clips.map((clip) => (
              <Draggable
                key={clip.id}
                axis="x"
                position={{ x: clip.position * pixelsPerSecond, y: 8 }}
                onDrag={(e, data) => handleClipDrag(clip.id, data)}
                bounds="parent"
              >
                <div
                  className={`absolute h-16 rounded-md cursor-pointer transition-all duration-200 ${
                    selectedClip?.id === clip.id 
                      ? 'ring-2 ring-primary bg-primary/20 border-primary' 
                      : 'bg-gradient-to-r from-primary/60 to-accent/60 border-border hover:from-primary/70 hover:to-accent/70'
                  } border`}
                  style={{ 
                    width: clip.duration * pixelsPerSecond,
                    minWidth: 60,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClipSelect(clip.id);
                  }}
                >
                  <div className="p-2 h-full flex flex-col justify-between text-white">
                    <div className="text-xs font-medium truncate">
                      {clip.name}
                    </div>
                    <div className="text-xs opacity-80">
                      {formatTime(clip.duration)}
                    </div>
                  </div>
                  
                  {/* Trim handles */}
                  <div className="absolute left-0 top-0 w-2 h-full bg-primary/80 cursor-w-resize opacity-0 hover:opacity-100 transition-opacity" />
                  <div className="absolute right-0 top-0 w-2 h-full bg-primary/80 cursor-e-resize opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </Draggable>
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none"
              style={{ left: currentTime * pixelsPerSecond }}
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full" />
            </div>
          </div>
        </div>

        {/* Drop Zone for new clips */}
        <div 
          className="h-12 bg-muted/30 border-t border-border/20 flex items-center justify-center"
          onDrop={(e) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            files.forEach((file, index) => {
              if (file.type.startsWith('video/')) {
                const position = currentTime + (index * 2); // Stagger clips
                useVideoEditorStore.getState().addClipToTimeline(file, position);
              }
            });
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm text-muted-foreground">
            Drop video files here or drag from media library
          </p>
        </div>
      </div>
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTimeRuler(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs === 0 ? `${mins}m` : `${secs}s`;
}