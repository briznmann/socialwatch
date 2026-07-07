import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react";
import { Profile } from "@shared/schema";
import Sidebar from "@/components/navigation/sidebar";
import AddProfileModal from "@/components/modals/add-profile";
import ScreenshotGallery from "@/components/modals/screenshot-gallery";

export default function Profiles() {
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: profiles, isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
  });

  const filteredProfiles = profiles?.filter(profile =>
    profile.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.platform.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const openGallery = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsGalleryOpen(true);
  };

  const platformColors: Record<string, string> = {
    twitter: "bg-blue-500",
    instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
    linkedin: "bg-blue-700",
    tiktok: "bg-black",
    facebook: "bg-blue-600",
    youtube: "bg-red-500",
  };

  const platformIcons: Record<string, string> = {
    twitter: "🐦",
    instagram: "📷",
    linkedin: "💼",
    tiktok: "🎵",
    facebook: "👥",
    youtube: "📺",
  };

  return (
    <>
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Profiles</h2>
                <p className="text-slate-600">Manage your monitored social media profiles</p>
              </div>
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search profiles..."
                    className="pl-10 pr-4 py-2 w-80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
                
                {/* Filter */}
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                
                {/* Add Profile */}
                <Button
                  onClick={() => setIsAddProfileOpen(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Profile
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-slate-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="h-8 bg-slate-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredProfiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {searchQuery ? 'No profiles found' : 'No profiles yet'}
                </h3>
                <p className="text-slate-600 mb-6">
                  {searchQuery 
                    ? 'Try adjusting your search terms.' 
                    : 'Add your first social media profile to start monitoring.'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setIsAddProfileOpen(true)}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Profile
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProfiles.map((profile) => (
                  <Card 
                    key={profile.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => openGallery(profile)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
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
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base truncate">
                              @{profile.handle}
                            </CardTitle>
                            <p className="text-sm text-slate-600 capitalize">
                              {profile.platform}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-slate-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant={profile.needsReconnect ? "destructive" : profile.isActive ? "default" : "secondary"}>
                            {profile.needsReconnect ? "Reconnect" : profile.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <span className="text-sm text-slate-600">
                            {profile.totalScreenshots} screenshots
                          </span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Last captured: {profile.lastCapturedAt 
                            ? new Date(profile.lastCapturedAt).toLocaleDateString()
                            : 'Never'
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <AddProfileModal
        isOpen={isAddProfileOpen}
        onClose={() => setIsAddProfileOpen(false)}
      />

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
