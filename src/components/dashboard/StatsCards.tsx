import { Files, HardDrive, Upload, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  totalFiles: number;
  totalSize: number;
}

export const StatsCards = ({ totalFiles, totalSize }: StatsCardsProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const storageLimit = 10 * 1024 * 1024 * 1024; // 10GB limit
  const usagePercentage = (totalSize / storageLimit) * 100;

  const stats = [
    {
      title: "Total Files",
      value: totalFiles.toLocaleString(),
      icon: Files,
      description: "Files stored",
      color: "text-primary"
    },
    {
      title: "Storage Used",
      value: formatFileSize(totalSize),
      icon: HardDrive,
      description: `${usagePercentage.toFixed(1)}% of 10GB`,
      color: "text-accent"
    },
    {
      title: "Recent Uploads",
      value: "12",
      icon: Upload,
      description: "This week",
      color: "text-success"
    },
    {
      title: "Growth",
      value: "+23%",
      icon: TrendingUp,
      description: "vs last month",
      color: "text-warning"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card
            key={stat.title}
            className="glass hover-lift animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div className={`${stat.color} opacity-80`}>
                  <Icon className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};