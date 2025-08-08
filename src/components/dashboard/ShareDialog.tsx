import { useState, useEffect } from "react";
import { Copy, Check, Globe, Lock, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

interface ShareDialogProps {
  file: FileItem;
  onClose: () => void;
}

export const ShareDialog = ({ file, onClose }: ShareDialogProps) => {
  const [shareLink, setShareLink] = useState(`https://lifecloud.app/share/${file.id}`);
  const [copied, setCopied] = useState(false);
  const [accessLevel, setAccessLevel] = useState("view");
  const [expiryEnabled, setExpiryEnabled] = useState(false);
  const [expiryDays, setExpiryDays] = useState("7");
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const generateShareLink = () => {
    // Simulate generating a new share link based on settings
    const baseUrl = `https://lifecloud.app/share/${file.id}`;
    const params = new URLSearchParams();
    
    if (accessLevel !== "view") {
      params.append("access", accessLevel);
    }
    
    if (expiryEnabled) {
      params.append("expires", expiryDays);
    }
    
    if (passwordProtected && password) {
      params.append("protected", "true");
    }

    const newLink = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    setShareLink(newLink);
  };

  // Generate new link when settings change
  useEffect(() => {
    generateShareLink();
  }, [accessLevel, expiryEnabled, expiryDays, passwordProtected, password]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="glass max-w-md">
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
          <DialogDescription>
            Create a shareable link for "{file.originalName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Share Link */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex space-x-2">
              <Input
                value={shareLink}
                readOnly
                className="glass"
              />
              <Button variant="outline" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Access Level */}
          <div className="space-y-3">
            <Label>Access Level</Label>
            <RadioGroup value={accessLevel} onValueChange={setAccessLevel}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="view" id="view" />
                <Label htmlFor="view" className="flex items-center space-x-2 cursor-pointer">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>View only</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="download" id="download" />
                <Label htmlFor="download" className="flex items-center space-x-2 cursor-pointer">
                  <Users className="h-4 w-4 text-accent" />
                  <span>View and download</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Expiry Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Link Expiry</Label>
              <Switch
                checked={expiryEnabled}
                onCheckedChange={setExpiryEnabled}
              />
            </div>
            
            {expiryEnabled && (
              <Select value={expiryDays} onValueChange={setExpiryDays}>
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Password Protection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Password Protection</Label>
              <Switch
                checked={passwordProtected}
                onCheckedChange={setPasswordProtected}
              />
            </div>
            
            {passwordProtected && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 glass"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="hero" onClick={handleCopy} className="flex-1">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          {/* Link Info */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/20">
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>
                {expiryEnabled 
                  ? `Expires in ${expiryDays} day${expiryDays !== "1" ? "s" : ""}`
                  : "Never expires"
                }
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-3 w-3" />
              <span>
                {passwordProtected ? "Password protected" : "No password required"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};