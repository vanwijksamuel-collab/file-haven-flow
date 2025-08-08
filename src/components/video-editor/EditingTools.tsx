import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Sun, 
  Contrast, 
  Palette,
  Zap,
  Scissors,
  RotateCcw
} from "lucide-react";
import { useVideoEditorStore } from "@/stores/videoEditorStore";

export const EditingTools = () => {
  const { selectedClip, updateClip } = useVideoEditorStore();
  const [activeTab, setActiveTab] = useState<'audio' | 'visual' | 'effects'>('visual');

  if (!selectedClip) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Editing Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a clip to edit</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSliderChange = (property: string, value: number[]) => {
    updateClip(selectedClip.id, { [property]: value[0] });
  };

  const toggleMute = () => {
    updateClip(selectedClip.id, { muted: !selectedClip.muted });
  };

  const resetVisuals = () => {
    updateClip(selectedClip.id, {
      brightness: 100,
      contrast: 100,
      saturation: 100,
    });
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Editing Tools
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {selectedClip.name}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
          <Button
            variant={activeTab === 'visual' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('visual')}
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTab === 'audio' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('audio')}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTab === 'effects' ? 'default' : 'ghost'}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab('effects')}
          >
            <Zap className="h-4 w-4" />
          </Button>
        </div>

        {/* Visual Controls */}
        {activeTab === 'visual' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Visual Adjustments</h4>
              <Button variant="ghost" size="sm" onClick={resetVisuals}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Brightness */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Label className="flex-1">Brightness</Label>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {selectedClip.brightness}%
                </span>
              </div>
              <Slider
                value={[selectedClip.brightness]}
                onValueChange={(value) => handleSliderChange('brightness', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Contrast className="h-4 w-4 text-muted-foreground" />
                <Label className="flex-1">Contrast</Label>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {selectedClip.contrast}%
                </span>
              </div>
              <Slider
                value={[selectedClip.contrast]}
                onValueChange={(value) => handleSliderChange('contrast', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-muted-foreground" />
                <Label className="flex-1">Saturation</Label>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {selectedClip.saturation}%
                </span>
              </div>
              <Slider
                value={[selectedClip.saturation]}
                onValueChange={(value) => handleSliderChange('saturation', value)}
                min={0}
                max={200}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Audio Controls */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <h4 className="font-medium">Audio Controls</h4>

            {/* Mute Toggle */}
            <div className="flex items-center justify-between">
              <Label>Mute Audio</Label>
              <Button
                variant={selectedClip.muted ? "destructive" : "outline"}
                size="sm"
                onClick={toggleMute}
              >
                {selectedClip.muted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Volume */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Label className="flex-1">Volume</Label>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {Math.round(selectedClip.volume * 100)}%
                </span>
              </div>
              <Slider
                value={[selectedClip.volume]}
                onValueChange={(value) => handleSliderChange('volume', value)}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
                disabled={selectedClip.muted}
              />
            </div>
          </div>
        )}

        {/* Effects Controls */}
        {activeTab === 'effects' && (
          <div className="space-y-4">
            <h4 className="font-medium">Transitions</h4>

            {/* Fade In */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <Label className="flex-1">Fade In</Label>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {selectedClip.fadeIn.toFixed(1)}s
                </span>
              </div>
              <Slider
                value={[selectedClip.fadeIn]}
                onValueChange={(value) => handleSliderChange('fadeIn', value)}
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Fade Out */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-muted-foreground rotate-180" />
                <Label className="flex-1">Fade Out</Label>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {selectedClip.fadeOut.toFixed(1)}s
                </span>
              </div>
              <Slider
                value={[selectedClip.fadeOut]}
                onValueChange={(value) => handleSliderChange('fadeOut', value)}
                min={0}
                max={5}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="border-t border-border/20 pt-4">
          <h4 className="font-medium mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Scissors className="h-3 w-3" />
              Trim
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};