import { useRef, useEffect, useState } from "react";
import { useVideoEditorStore } from "@/stores/videoEditorStore";
import { Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPreviewProps {
  currentTime: number;
  onTimeUpdate: (time: number) => void;
}

export const VideoPreview = ({ currentTime, onTimeUpdate }: VideoPreviewProps) => {
  const { project, selectedClip } = useVideoEditorStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [currentClip, setCurrentClip] = useState<any>(null);

  useEffect(() => {
    if (!project || !videoRef.current) return;

    // Find the clip that should be playing at current time
    const activeClip = project.clips.find(clip => 
      currentTime >= clip.position && currentTime < clip.position + clip.duration
    );

    if (activeClip && activeClip !== currentClip) {
      setCurrentClip(activeClip);
      videoRef.current.src = activeClip.url;
      videoRef.current.currentTime = (currentTime - activeClip.position) + activeClip.startTime;
    } else if (activeClip) {
      const relativeTime = (currentTime - activeClip.position) + activeClip.startTime;
      if (Math.abs(videoRef.current.currentTime - relativeTime) > 0.2) {
        videoRef.current.currentTime = relativeTime;
      }
    }
  }, [currentTime, project, currentClip]);

  useEffect(() => {
    if (!videoRef.current || !currentClip) return;

    const video = videoRef.current;
    video.volume = currentClip.muted ? 0 : currentClip.volume;
    video.muted = isMuted || currentClip.muted;

    // Apply filters based on clip settings
    const filters = [
      `brightness(${currentClip.brightness}%)`,
      `contrast(${currentClip.contrast}%)`,
      `saturate(${currentClip.saturation}%)`,
    ];
    
    video.style.filter = filters.join(' ');
  }, [currentClip, isMuted]);

  const handleVideoClick = () => {
    if (!project || project.clips.length === 0) return;
    
    const { setPlaying, isPlaying } = useVideoEditorStore.getState();
    setPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!project) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No Project Loaded</p>
          <p className="text-sm">Create a project to start editing</p>
        </div>
      </div>
    );
  }

  if (project.clips.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No Video Clips</p>
          <p className="text-sm">Drag video files to the timeline to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative group bg-black rounded-lg overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        onClick={handleVideoClick}
        muted={isMuted}
        playsInline
      />
      
      {/* Canvas for effects overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none opacity-0"
      />

      {/* Overlay Controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="glass"
              size="icon-sm"
              onClick={toggleMute}
              className="text-white hover:text-white"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="text-white text-sm font-medium">
            {currentClip ? currentClip.name : "No clip selected"}
          </div>
        </div>
      </div>

      {/* Selected clip indicator */}
      {selectedClip && (
        <div className="absolute top-4 left-4">
          <div className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
            Editing: {selectedClip.name}
          </div>
        </div>
      )}
    </div>
  );
};