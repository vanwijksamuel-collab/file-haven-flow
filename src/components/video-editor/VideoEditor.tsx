import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Download } from "lucide-react";
import { VideoPreview } from "./VideoPreview";
import { Timeline } from "./Timeline";
import { MediaLibrary } from "./MediaLibrary";
import { EditingTools } from "./EditingTools";
import { ExportDialog } from "./ExportDialog";
import { useVideoEditorStore } from "@/stores/videoEditorStore";
import { useToast } from "@/hooks/use-toast";

interface VideoEditorProps {
  onBack: () => void;
}

export const VideoEditor = ({ onBack }: VideoEditorProps) => {
  const { 
    project, 
    isPlaying, 
    selectedClip,
    createProject,
    setPlaying,
    setCurrentTime,
  } = useVideoEditorStore();
  
  const { toast } = useToast();
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [currentTime, setTime] = useState(0);

  useEffect(() => {
    // Create default project if none exists
    if (!project) {
      createProject("New Video Project");
    }
  }, [project, createProject]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && project) {
      interval = setInterval(() => {
        setTime(prev => {
          const newTime = prev + 0.1;
          if (newTime >= project.duration) {
            setPlaying(false);
            return 0;
          }
          setCurrentTime(newTime);
          return newTime;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, project, setPlaying, setCurrentTime]);

  const handlePlayPause = () => {
    if (!project || project.clips.length === 0) {
      toast({
        title: "No video clips",
        description: "Add some video clips to the timeline first.",
        variant: "destructive"
      });
      return;
    }
    setPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setTime(time);
    setCurrentTime(time);
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 10);
    handleSeek(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(project?.duration || 0, currentTime + 10);
    handleSeek(newTime);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass border-b border-border/20 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold gradient-text">LifeCloud Video Studio</h1>
                <p className="text-sm text-muted-foreground">
                  {project?.name || "Loading project..."}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setShowExportDialog(true)}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Media Library & Tools */}
        <div className="w-80 border-r border-border/20 bg-surface/50 backdrop-blur-sm">
          <div className="p-4 space-y-4">
            <MediaLibrary />
            <EditingTools />
          </div>
        </div>

        {/* Center - Video Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <Card className="h-full glass flex items-center justify-center">
              <VideoPreview 
                currentTime={currentTime}
                onTimeUpdate={handleSeek}
              />
            </Card>
          </div>

          {/* Bottom - Timeline & Controls */}
          <div className="border-t border-border/20 bg-surface/50 backdrop-blur-sm">
            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-4 p-4 border-b border-border/20">
              <Button variant="ghost" size="icon" onClick={handleSkipBack}>
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button variant="hero" size="icon" onClick={handlePlayPause}>
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={handleSkipForward}>
                <SkipForward className="h-4 w-4" />
              </Button>
              
              <div className="text-sm text-muted-foreground min-w-32 text-center">
                {formatTime(currentTime)} / {formatTime(project?.duration || 0)}
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4">
              <Timeline 
                currentTime={currentTime}
                onSeek={handleSeek}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog 
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      />
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}