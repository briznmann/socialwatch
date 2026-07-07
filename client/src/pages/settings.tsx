import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/navigation/sidebar";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      summary: true,
    },
    monitoring: {
      interval: 15,
      autoReconnect: true,
      captureText: true,
    },
    privacy: {
      shareData: false,
      analytics: true,
    },
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    // Mock save delay
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    }, 1000);
  };

  const subscriptionTier = user?.subscriptionTier || 'free';
  const tierName = subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
              <p className="text-slate-600">Manage your account and preferences</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.profileImageUrl || ""} alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-slate-600">{user?.email}</p>
                    <Badge className="mt-2">
                      {tierName} Plan
                    </Badge>
                  </div>
                  <Button variant="outline">
                    Change Photo
                  </Button>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue={user?.firstName || ""}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue={user?.lastName || ""}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ""}
                    placeholder="Email address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-slate-600">Receive email alerts for important updates</p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-slate-600">Get real-time notifications on your device</p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Summary Reports</Label>
                    <p className="text-sm text-slate-600">Weekly summary of captured content</p>
                  </div>
                  <Switch
                    checked={settings.notifications.summary}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, summary: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Monitoring Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Monitoring</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="interval">Polling Interval (seconds)</Label>
                  <Input
                    id="interval"
                    type="number"
                    min="10"
                    max="60"
                    value={settings.monitoring.interval}
                    onChange={(e) =>
                      setSettings(prev => ({
                        ...prev,
                        monitoring: { ...prev.monitoring, interval: parseInt(e.target.value) }
                      }))
                    }
                  />
                  <p className="text-sm text-slate-600 mt-1">
                    How often to check for new content (minimum 10 seconds)
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto Reconnect</Label>
                    <p className="text-sm text-slate-600">Automatically attempt to reconnect broken profiles</p>
                  </div>
                  <Switch
                    checked={settings.monitoring.autoReconnect}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        monitoring: { ...prev.monitoring, autoReconnect: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Capture Text</Label>
                    <p className="text-sm text-slate-600">Extract text content for search indexing</p>
                  </div>
                  <Switch
                    checked={settings.monitoring.captureText}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        monitoring: { ...prev.monitoring, captureText: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Subscription */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{tierName} Plan</h3>
                    <p className="text-sm text-slate-600">
                      {subscriptionTier === 'free' 
                        ? 'Upgrade to unlock more features'
                        : `Next billing: Aug 15, 2025`
                      }
                    </p>
                  </div>
                  <Button className="btn-primary">
                    {subscriptionTier === 'free' ? 'Upgrade' : 'Manage Billing'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Share Anonymous Usage Data</Label>
                    <p className="text-sm text-slate-600">Help improve SocialWatch with anonymous usage statistics</p>
                  </div>
                  <Switch
                    checked={settings.privacy.shareData}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, shareData: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Analytics</Label>
                    <p className="text-sm text-slate-600">Enable analytics to track your usage patterns</p>
                  </div>
                  <Switch
                    checked={settings.privacy.analytics}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, analytics: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
