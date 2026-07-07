import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Calendar } from "lucide-react";
import { Screenshot, Profile } from "@shared/schema";
import Sidebar from "@/components/navigation/sidebar";

interface ScreenshotWithProfile extends Screenshot {
  profile: Profile;
}

export default function Screenshots() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: screenshots, isLoading } = useQuery<ScreenshotWithProfile[]>({
    queryKey: ["/api/screenshots/recent"],
  });

  const filteredScreenshots = screenshots?.filter(screenshot =>
    screenshot.profile.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    screenshot.postText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    screenshot.profile.platform.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Screenshots</h2>
              <p className="text-slate-600">Browse all captured social media content</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search screenshots..."
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

              {/* Date Range */}
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="aspect-video bg-slate-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredScreenshots.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📷</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {searchQuery ? 'No screenshots found' : 'No screenshots yet'}
              </h3>
              <p className="text-slate-600">
                {searchQuery 
                  ? 'Try adjusting your search terms.' 
                  : 'Screenshots will appear here as your profiles are monitored.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredScreenshots.map((screenshot) => (
                <Card 
                  key={screenshot.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <CardContent className="p-4">
                    <div className="aspect-video bg-slate-100 rounded-lg border border-slate-200 mb-3 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                      <span className="text-4xl">📷</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 ${platformColors[screenshot.profile.platform]} rounded-full flex items-center justify-center text-white text-xs`}>
                            {platformIcons[screenshot.profile.platform] || "📱"}
                          </div>
                          <span className="font-medium text-sm text-slate-900 truncate">
                            @{screenshot.profile.handle}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {screenshot.profile.platform}
                        </Badge>
                      </div>
                      
                      {screenshot.postText && (
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {screenshot.postText}
                        </p>
                      )}
                      
                      <p className="text-xs text-slate-500">
                        {screenshot.capturedAt ? new Date(screenshot.capturedAt).toLocaleString() : 'Unknown date'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
