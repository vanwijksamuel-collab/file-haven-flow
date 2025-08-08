import { useState } from "react";
import { Plus, Search, Grid3X3, List, Settings, User, LogOut, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoEditor } from "@/components/video-editor/VideoEditor";
import { Input } from "@/components/ui/input";
import { FileUpload } from "./FileUpload";
import { FileGrid } from "./FileGrid";
import { FileList } from "./FileList";
import { StatsCards } from "./StatsCards";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

interface DashboardProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "document_2024_001",
      originalName: "Project Proposal.pdf",
      type: "application/pdf",
      size: 2456789,
      uploadDate: new Date("2024-01-15"),
      url: "#",
      thumbnail: "/placeholder.svg"
    },
    {
      id: "2",
      name: "image_2024_002",
      originalName: "Team Photo.jpg",
      type: "image/jpeg",
      size: 1234567,
      uploadDate: new Date("2024-01-14"),
      url: "#",
      thumbnail: "/placeholder.svg"
    },
    {
      id: "3",
      name: "spreadsheet_2024_003",
      originalName: "Budget Analysis.xlsx",
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      size: 987654,
      uploadDate: new Date("2024-01-13"),
      url: "#",
      thumbnail: "/placeholder.svg"
    }
  ]);
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showVideoEditor, setShowVideoEditor] = useState(false);

  const handleFileUpload = (uploadedFiles: File[]) => {
    const newFiles: FileItem[] = uploadedFiles.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      originalName: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
      url: URL.createObjectURL(file),
      thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setFiles(prev => [...newFiles, ...prev]);
    setShowUpload(false);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const totalFiles = files.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass border-b border-border/20 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold gradient-text">LifeCloud</h1>
              <div className="hidden md:flex items-center space-x-2 ml-8">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 glass border-0"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon-sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowVideoEditor(true)}
                className="hidden md:flex"
              >
                <Video className="h-4 w-4" />
                Video Editor
              </Button>
              
              <Button
                variant="hero"
                onClick={() => setShowUpload(true)}
                className="hidden md:flex"
              >
                <Plus className="h-4 w-4" />
                Upload Files
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass">
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Mobile search */}
          <div className="md:hidden mt-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 glass border-0"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <StatsCards totalFiles={totalFiles} totalSize={totalSize} />
        
        {/* Upload Area */}
        {showUpload && (
          <div className="mb-8 animate-fade-in-up">
            <FileUpload
              onUpload={handleFileUpload}
              onCancel={() => setShowUpload(false)}
            />
          </div>
        )}
        
        {/* Mobile Buttons */}
        <div className="md:hidden mb-6 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => setShowVideoEditor(true)}
            className="w-full"
          >
            <Video className="h-4 w-4" />
            Video Editor
          </Button>
          <Button
            variant="hero"
            onClick={() => setShowUpload(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4" />
            Upload Files
          </Button>
        </div>

        {/* Files Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Your Files {filteredFiles.length > 0 && `(${filteredFiles.length})`}
            </h2>
          </div>
          
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="glass rounded-xl p-8 max-w-md mx-auto">
                <div className="text-muted-foreground mb-4">
                  {searchQuery ? "No files match your search." : "No files uploaded yet."}
                </div>
                {!searchQuery && (
                  <Button variant="hero" onClick={() => setShowUpload(true)}>
                    <Plus className="h-4 w-4" />
                    Upload Your First File
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <FileGrid files={filteredFiles} onDelete={handleDeleteFile} />
              ) : (
                <FileList files={filteredFiles} onDelete={handleDeleteFile} />
              )}
            </>
          )}
        </div>
      </main>

      {/* Video Editor Modal */}
      {showVideoEditor && (
        <div className="fixed inset-0 z-50">
          <VideoEditor onBack={() => setShowVideoEditor(false)} />
        </div>
      )}
    </div>
  );
};