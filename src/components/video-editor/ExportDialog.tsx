import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Settings, Video, AlertCircle } from "lucide-react";
import { useVideoEditorStore } from "@/stores/videoEditorStore";
import { useToast } from "@/hooks/use-toast";

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ExportDialog = ({ open, onClose }: ExportDialogProps) => {
  const { 
    project, 
    isExporting, 
    exportProgress,
    setExporting,
    setExportProgress,
    setQuality 
  } = useVideoEditorStore();
  
  const { toast } = useToast();
  const [format, setFormat] = useState('mp4');
  const [quality, setQualityLocal] = useState<'480p' | '720p' | '1080p'>(project?.quality || '1080p');

  const qualitySettings = {
    '480p': { width: 854, height: 480, bitrate: '1000k' },
    '720p': { width: 1280, height: 720, bitrate: '2500k' },
    '1080p': { width: 1920, height: 1080, bitrate: '5000k' },
  };

  const handleExport = async () => {
    if (!project || project.clips.length === 0) {
      toast({
        title: "No content to export",
        description: "Add video clips to your timeline first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setExporting(true);
      setExportProgress(0);
      setQuality(quality);

      // Simulate export process with progress
      const totalSteps = 10;
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setExportProgress((i / totalSteps) * 100);
      }

      // In a real implementation, this would use FFmpeg.wasm
      // For demo purposes, we'll create a download link
      const link = document.createElement('a');
      link.href = '#'; // Would be the actual video blob URL
      link.download = `${project.name}_${quality}.${format}`;
      
      toast({
        title: "Export completed!",
        description: `Your video has been exported in ${quality} quality.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An error occurred while exporting your video.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
      setExportProgress(0);
    }
  };

  const estimatedFileSize = () => {
    if (!project) return "Unknown";
    const duration = project.duration;
    const settings = qualitySettings[quality];
    const bitrateKbps = parseInt(settings.bitrate.replace('k', ''));
    const sizeBytes = (duration * bitrateKbps * 1000) / 8;
    const sizeMB = sizeBytes / (1024 * 1024);
    return `${sizeMB.toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Video
          </DialogTitle>
          <DialogDescription>
            Choose your export settings and download your edited video.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Info */}
          <Card className="bg-surface/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-primary/20 rounded flex items-center justify-center">
                  <Video className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{project?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {project?.clips.length} clips • {formatDuration(project?.duration || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Export Settings</Label>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Select value={quality} onValueChange={(value: any) => setQualityLocal(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="480p">480p (Standard)</SelectItem>
                  <SelectItem value="720p">720p (HD)</SelectItem>
                  <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4 (Recommended)</SelectItem>
                  <SelectItem value="webm">WebM</SelectItem>
                  <SelectItem value="mov">MOV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preview Settings */}
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolution:</span>
                    <span>{qualitySettings[quality].width} × {qualitySettings[quality].height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bitrate:</span>
                    <span>{qualitySettings[quality].bitrate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. file size:</span>
                    <span>{estimatedFileSize()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Exporting video...</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(exportProgress)}%
                </span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          )}

          {/* Warning for demo */}
          <div className="flex items-start space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning">Demo Mode</p>
              <p className="text-muted-foreground">
                This is a demonstration. In production, FFmpeg.wasm would process your video.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="hero"
              onClick={handleExport}
              disabled={isExporting || !project || project.clips.length === 0}
              className="flex-1"
            >
              {isExporting ? "Exporting..." : "Export Video"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}