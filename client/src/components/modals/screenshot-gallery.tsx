import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Profile, Screenshot } from "@shared/schema";

interface ScreenshotGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
}

export default function ScreenshotGallery({ isOpen, onClose, profile }: ScreenshotGalleryProps) {
  const { data: screenshots, isLoading } = useQuery<Screenshot[]>({
    queryKey: ["/api/profiles", profile.id, "screenshots"],
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                Screenshots from @{profile.handle}
              </DialogTitle>
              <p className="text-slate-600">
                {profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1)} • {profile.totalScreenshots} total screenshots
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="max-h-[70vh] overflow-y-auto p-1">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-full h-32 bg-slate-200 rounded-lg"></div>
                  <div className="h-3 bg-slate-200 rounded w-16 mt-2"></div>
                </div>
              ))}
            </div>
          ) : !screenshots || screenshots.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">No screenshots available for this profile.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {screenshots.map((screenshot) => (
                <div key={screenshot.id} className="group cursor-pointer">
                  <div className="w-full h-32 bg-slate-100 rounded-lg border border-slate-200 group-hover:shadow-lg transition-shadow flex items-center justify-center">
                    <span className="text-4xl">📷</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {screenshot.capturedAt ? new Date(screenshot.capturedAt).toLocaleString() : 'Unknown date'}
                  </p>
                  {screenshot.postText && (
                    <p className="text-xs text-slate-700 mt-1 line-clamp-2">
                      {screenshot.postText}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
