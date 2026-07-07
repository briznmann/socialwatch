import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Screenshot, Profile } from "@shared/schema";

interface RecentScreenshot extends Screenshot {
  profile: Profile;
}

export default function RecentScreenshots() {
  const { data: screenshots, isLoading } = useQuery<RecentScreenshot[]>({
    queryKey: ["/api/screenshots/recent"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Screenshots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="w-12 h-8 bg-slate-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Screenshots</CardTitle>
          <Link href="/screenshots">
            <Button variant="ghost" size="sm" className="text-primary hover:text-blue-600">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {!screenshots || screenshots.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-slate-600 text-sm">No screenshots captured yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {screenshots.map((screenshot) => (
              <div key={screenshot.id} className="flex items-center space-x-3">
                <div className="w-12 h-8 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-xs text-slate-500">
                  📷
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    @{screenshot.profile.handle}
                  </p>
                  <p className="text-xs text-slate-500">
                    {screenshot.capturedAt ? new Date(screenshot.capturedAt).toLocaleString() : 'Unknown date'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
