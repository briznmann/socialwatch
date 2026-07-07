import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Filter, MoreHorizontal } from "lucide-react";
import { Profile } from "@shared/schema";
import ScreenshotGallery from "@/components/modals/screenshot-gallery";

const platformIcons: Record<string, string> = {
  twitter: "🐦",
  instagram: "📷",
  linkedin: "💼",
  tiktok: "🎵",
  facebook: "👥",
  youtube: "📺",
};

const platformColors: Record<string, string> = {
  twitter: "bg-blue-500",
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  linkedin: "bg-blue-700",
  tiktok: "bg-black",
  facebook: "bg-blue-600",
  youtube: "bg-red-500",
};

export default function MonitoredProfiles() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const { data: profiles, isLoading, refetch } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
  });

  const handleRefresh = () => {
    refetch();
  };

  const openGallery = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsGalleryOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monitored Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-48"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Monitored Profiles</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className="text-slate-600 hover:text-slate-900"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!profiles || profiles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">No profiles being monitored yet.</p>
              <p className="text-sm text-slate-500 mt-2">Add your first profile to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => openGallery(profile)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={profile.avatarUrl || ""} alt={profile.handle} />
                        <AvatarFallback>
                          {profile.handle.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${platformColors[profile.platform]} rounded-full flex items-center justify-center text-white text-xs`}>
                        {platformIcons[profile.platform] || "📱"}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">@{profile.handle}</h4>
                      <p className="text-sm text-slate-600">
                        {profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1)} • 
                        Last captured {profile.lastCapturedAt ? 
                          new Date(profile.lastCapturedAt).toLocaleString() : 'Never'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={profile.needsReconnect ? "destructive" : "default"}>
                      {profile.needsReconnect ? "Reconnect" : profile.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-slate-600">
                      {profile.totalScreenshots} posts
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-slate-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedProfile && (
        <ScreenshotGallery
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          profile={selectedProfile}
        />
      )}
    </>
  );
}
